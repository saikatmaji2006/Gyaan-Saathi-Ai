import logging
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.llm_service import transcribe_audio, call_groq, call_groq_text
from services.tts_service import generate_speech
from prompts import INTENT_PROMPT, LESSON_PROMPT, QUIZ_PROMPT, SAFETY_RULES

logger = logging.getLogger("gyaansaathi.voice")

router = APIRouter(prefix="/api/voice", tags=["Voice"])


@router.post("/process")
async def process_voice(
    audio: UploadFile = File(...),
    language: str = Form("hinglish"),
):
    """
    Full voice pipeline: Transcribe -> Detect Intent -> Generate Content -> TTS.
    This is the main endpoint for the voice-first workflow.
    """
    try:
        # Step 1: Read audio
        audio_bytes = await audio.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")

        # Step 2: Transcribe with Whisper
        transcript = await transcribe_audio(
            audio_bytes,
            filename=audio.filename or "recording.webm",
            content_type=audio.content_type or "audio/webm",
        )

        if not transcript.strip():
            return {
                "transcript": "",
                "intent": {"action": "unknown"},
                "content": None,
                "audio_url": None,
                "session_id": None,
                "error": "Could not understand audio. Please try again.",
            }

        # Step 3: Detect intent
        intent_prompt = INTENT_PROMPT.format(user_input=transcript)
        intent_result = await call_groq(intent_prompt, temperature=0.3)

        action = intent_result.get("action", "unknown")
        topic = intent_result.get("topic")
        class_level = intent_result.get("class_level") or 8
        subject = intent_result.get("subject") or "Auto"
        difficulty = intent_result.get("difficulty") or "medium"
        question_count = intent_result.get("question_count") or 10

        # Step 4: Generate content based on intent
        content = None
        audio_url = None
        session_id = f"sess_{uuid.uuid4().hex[:8]}"

        if action == "explain" and topic:
            lesson_prompt = LESSON_PROMPT.format(
                topic=topic, class_level=class_level, subject=subject,
                difficulty=difficulty, language=language,
            )
            content = await call_groq(lesson_prompt)
            content["lesson_id"] = f"les_{uuid.uuid4().hex[:8]}"

            # Generate TTS for first section
            sections = content.get("sections", [])
            if sections and sections[0].get("speak_text"):
                audio_url = await generate_speech(sections[0]["speak_text"], language)

        elif action == "quiz" and topic:
            quiz_prompt = QUIZ_PROMPT.format(
                topic=topic, class_level=class_level, difficulty=difficulty,
                question_count=question_count, language=language,
            )
            content = await call_groq(quiz_prompt)
            content["quiz_id"] = f"quiz_{uuid.uuid4().hex[:8]}"
            content["topic"] = topic
            content["difficulty"] = difficulty

        elif action == "unknown":
            audio_url = await generate_speech(
                "Main samajh nahi paaya. Kripya phir se boliye. Aap bol sakte hain 'Explain' ya 'Quiz generate karo'.",
                language,
            )

        return {
            "transcript": transcript,
            "intent": intent_result,
            "content": content,
            "audio_url": audio_url,
            "session_id": session_id,
        }

    except HTTPException:
        raise
    except RuntimeError as e:
        logger.error(f"Runtime error in process_voice: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Voice processing error: {e}")
        raise HTTPException(status_code=500, detail="Voice processing failed due to internal error.")


@router.post("/speak")
async def speak_text(text: str = Form(...), language: str = Form("hi"), voice: str = Form(None)):
    """Convert text to speech using Edge-TTS."""
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    audio_url = await generate_speech(text, language, voice)
    if not audio_url:
        raise HTTPException(status_code=500, detail="TTS generation failed")

    return {"audio_url": audio_url}


@router.post("/transcribe")
async def transcribe_only(audio: UploadFile = File(...)):
    """Transcribe audio without intent detection -- useful for quiz answers."""
    try:
        audio_bytes = await audio.read()
        transcript = await transcribe_audio(
            audio_bytes,
            filename=audio.filename or "recording.webm",
            content_type=audio.content_type or "audio/webm",
        )
        return {"transcript": transcript}
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed due to internal error.")


@router.post("/ask_text")
async def ask_voice_copilot(
    question: str = Form(...),
    context: str = Form(...)
):
    """
    Voice Copilot: Answers student questions about the current lesson.
    Returns a short conversational answer in Hinglish for TTS playback.
    """
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    prompt = f"""You are GyaanSaathi, a friendly AI teaching assistant in an Indian classroom.

The student is currently learning about:
{context}

The student just asked: "{question}"

Reply with a brief, helpful answer.
Rules:
1. Speak in Hinglish (mix of Hindi and English in Latin script).
2. Keep it VERY short: 1-3 sentences maximum.
3. No markdown, no emojis, no bullet points, no special characters.
5. Only answer about the topic. If the question is unrelated, gently redirect.

{SAFETY_RULES}"""

    try:
        answer = await call_groq_text(prompt, temperature=0.6, max_tokens=150)
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Voice copilot error: {e}")
        raise HTTPException(status_code=500, detail="Voice copilot failed due to internal error.")


