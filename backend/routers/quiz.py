import logging
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.llm_service import call_groq
from services.tts_service import generate_speech
from prompts import QUIZ_PROMPT, HINT_PROMPT

logger = logging.getLogger("gyaansaathi.quiz")

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])


class QuizRequest(BaseModel):
    topic: str
    class_level: int = 8
    difficulty: str = "medium"
    question_count: int = 10
    language: str = "hinglish"
    session_id: Optional[str] = None


class AnswerRequest(BaseModel):
    quiz_id: str
    question_id: str
    answer: str
    attempt_number: int = 1
    correct_answer: str
    question_text: str = ""
    explanation: str = ""
    language: str = "hinglish"


@router.post("/generate")
async def generate_quiz(req: QuizRequest):
    """Generate a quiz with MCQ questions."""
    try:
        prompt = QUIZ_PROMPT.format(
            topic=req.topic,
            class_level=req.class_level,
            difficulty=req.difficulty,
            question_count=req.question_count,
            language=req.language,
        )
        result = await call_groq(prompt)
        result["quiz_id"] = f"quiz_{uuid.uuid4().hex[:8]}"
        result["topic"] = req.topic
        result["difficulty"] = req.difficulty

        # Generate TTS for first question
        questions = result.get("questions", [])
        if questions and questions[0].get("speak_text"):
            audio_url = await generate_speech(questions[0]["speak_text"], req.language)
            questions[0]["audio_url"] = audio_url

        return result

    except HTTPException:
        raise
    except RuntimeError as e:
        logger.error(f"Runtime error in generate_quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        raise HTTPException(status_code=500, detail="Quiz generation failed due to internal error.")


@router.post("/answer")
async def check_answer(req: AnswerRequest):
    """Check a quiz answer and provide feedback/hints."""
    is_correct = req.answer.strip().upper() == req.correct_answer.strip().upper()

    feedback = ""
    hint = None
    speak_text = ""

    if is_correct:
        feedback = "Correct! Excellent! 🎉"
        speak_text = "Bilkul sahi! Bahut acche!" if req.language != "english" else "That's correct! Excellent!"

    elif req.attempt_number >= 3:
        # Reveal answer after 3 attempts
        correct_text = ""
        if req.explanation:
            correct_text = req.explanation
        feedback = f"The correct answer is Option {req.correct_answer}. {correct_text}"
        speak_text = f"Sahi jawab hai Option {req.correct_answer}. {correct_text}" if req.language != "english" else feedback

    elif req.attempt_number >= 2:
        # Generate AI hint after 2nd wrong attempt
        try:
            hint_prompt = HINT_PROMPT.format(
                question=req.question_text,
                wrong_answer=req.answer,
                wrong_option=f"Option {req.answer}",
                correct_answer=req.correct_answer,
                correct_option=f"Option {req.correct_answer}",
                attempt_number=req.attempt_number,
                language=req.language,
            )
            hint_result = await call_groq(hint_prompt, temperature=0.5)
            hint = hint_result.get("hint", "Think about what we learned in the lesson.")
            speak_text = hint_result.get("speak_text", hint)
        except Exception as e:
            logger.error(f"Hint generation error: {e}")
            hint = "Lesson mein jo concept padha tha, uske baare mein socho." if req.language != "english" else "Think about the concept from the lesson."
            speak_text = hint
        feedback = f"Not quite. Here's a hint: {hint}"

    else:
        # First wrong attempt — simple encouragement
        feedback = "Not quite. Try again!"
        speak_text = "Yeh sahi nahi hai. Ek baar aur try karo!" if req.language != "english" else "That's not right. Try again!"

    # Generate TTS for feedback
    audio_url = await generate_speech(speak_text, req.language) if speak_text else None

    return {
        "is_correct": is_correct,
        "attempts_used": req.attempt_number,
        "max_attempts": 3,
        "feedback": feedback,
        "hint": hint,
        "speak_text": speak_text,
        "audio_url": audio_url,
    }


@router.post("/speak-question")
async def speak_question(question_text: str, language: str = "hinglish"):
    """Generate TTS for a quiz question."""
    audio_url = await generate_speech(question_text, language)
    if not audio_url:
        raise HTTPException(status_code=500, detail="TTS failed")
    return {"audio_url": audio_url}
