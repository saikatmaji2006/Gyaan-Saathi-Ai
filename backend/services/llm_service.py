import json
import logging
import httpx
from fastapi import HTTPException
from config import GROQ_API_KEY, GROQ_MODEL, WHISPER_MODEL

logger = logging.getLogger("gyaansaathi.llm")

async def call_groq(prompt: str, temperature: float = 0.7, max_tokens: int = 4096) -> dict:
    """Call Groq API with a prompt and return parsed JSON response."""
    if not GROQ_API_KEY:
        logger.error("GROQ_API_KEY is not set.")
        raise HTTPException(status_code=500, detail="LLM API key not configured.")

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "response_format": {"type": "json_object"},
                },
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)
    except httpx.HTTPStatusError as e:
        logger.error(f"Groq API HTTP error: {e.response.text}")
        raise HTTPException(status_code=502, detail="Upstream AI provider error.")
    except httpx.RequestError as e:
        logger.error(f"Groq API Request error: {str(e)}")
        raise HTTPException(status_code=504, detail="Upstream AI provider timeout.")
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Groq JSON response: {str(e)}\nContent: {content}")
        return {
            "title": "Error generating content",
            "sections": [
                {
                    "type": "concept",
                    "title": "Generation Error",
                    "explanation": "The AI provided an invalid response format. Please try again.",
                    "speak_text": "I had trouble formatting that. Please ask again."
                }
            ],
            "summary": "An error occurred.",
            "key_terms": []
        }
    except Exception as e:
        logger.error(f"Unexpected error in call_groq: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error generating content.")


async def call_groq_text(prompt: str, temperature: float = 0.7, max_tokens: int = 256) -> str:
    """Call Groq API with a prompt and return plain text response (no JSON)."""
    if not GROQ_API_KEY:
        logger.error("GROQ_API_KEY is not set.")
        raise HTTPException(status_code=500, detail="LLM API key not configured.")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        logger.error(f"Error in call_groq_text: {str(e)}")
        return "I'm having trouble thinking right now. Please try again."


async def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm", content_type: str = "audio/webm") -> str:
    """Transcribe audio using Whisper via Groq API."""
    if not GROQ_API_KEY:
        logger.error("GROQ_API_KEY is not set.")
        raise HTTPException(status_code=500, detail="LLM API key not configured.")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                files={"file": (filename, audio_bytes, content_type)},
                data={
                    "model": WHISPER_MODEL,
                    "language": "en",
                    "response_format": "json",
                },
            )
            response.raise_for_status()
            return response.json().get("text", "")
    except Exception as e:
        logger.error(f"Error in transcribe_audio: {str(e)}")
        return ""
