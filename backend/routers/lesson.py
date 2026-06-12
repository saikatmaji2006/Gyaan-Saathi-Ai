import logging
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.llm_service import call_groq
from services.tts_service import generate_speech
from prompts import LESSON_PROMPT, SIMPLIFY_PROMPT

logger = logging.getLogger("gyaansaathi.lesson")

router = APIRouter(prefix="/api/lesson", tags=["Lesson"])


class LessonRequest(BaseModel):
    topic: str
    class_level: int = 8
    subject: str = "Auto"
    difficulty: str = "medium"
    language: str = "hinglish"
    session_id: Optional[str] = None


class SimplifyRequest(BaseModel):
    topic: str
    class_level: int = 8
    subject: str = "Auto"
    language: str = "hinglish"


@router.post("/generate")
async def generate_lesson(req: LessonRequest):
    """Generate a structured lesson with teaching cards."""
    try:
        prompt = LESSON_PROMPT.format(
            topic=req.topic,
            class_level=req.class_level,
            subject=req.subject,
            difficulty=req.difficulty,
            language=req.language,
        )
        result = await call_groq(prompt)
        result["lesson_id"] = f"les_{uuid.uuid4().hex[:8]}"

        # Generate TTS for all sections
        sections = result.get("sections", [])
        for section in sections:
            speak_text = section.get("speak_text")
            if speak_text:
                audio_url = await generate_speech(speak_text, req.language)
                section["audio_url"] = audio_url

        return result

    except HTTPException:
        raise
    except RuntimeError as e:
        logger.error(f"Runtime error in generate_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Lesson generation error: {e}")
        raise HTTPException(status_code=500, detail="Lesson generation failed due to internal error.")


@router.post("/simplify")
async def simplify_lesson(req: SimplifyRequest):
    """Regenerate a lesson at a simpler difficulty level."""
    try:
        prompt = SIMPLIFY_PROMPT.format(
            topic=req.topic,
            class_level=req.class_level,
            subject=req.subject,
            language=req.language,
        )
        result = await call_groq(prompt)
        result["lesson_id"] = f"les_{uuid.uuid4().hex[:8]}"

        # Generate TTS for sections
        for section in result.get("sections", []):
            speak_text = section.get("speak_text")
            if speak_text:
                audio_url = await generate_speech(speak_text, req.language)
                section["audio_url"] = audio_url

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Simplification error: {e}")
        raise HTTPException(status_code=500, detail="Simplification failed due to internal error.")


@router.post("/speak-section")
async def speak_section(text: str, language: str = "hinglish"):
    """Generate TTS for a single lesson section."""
    audio_url = await generate_speech(text, language)
    if not audio_url:
        raise HTTPException(status_code=500, detail="TTS failed")
    return {"audio_url": audio_url}
