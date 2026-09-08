import json
import re
import logging
import asyncio
import httpx
from fastapi import HTTPException
from config import GROQ_API_KEY, GROQ_MODEL, WHISPER_MODEL

logger = logging.getLogger("gyaansaathi.llm")

# Minimal system message — saves tokens on every call
_SYSTEM_MSG = "Respond with valid JSON only. No markdown, no code fences, no extra text."


def _strip_thinking_tags(text: str) -> str:
    """Remove <think>...</think> blocks (safety net for thinking models)."""
    cleaned = re.sub(r"<think>[\s\S]*?</think>", "", text)
    cleaned = re.sub(r"<think>[\s\S]*$", "", cleaned)
    cleaned = cleaned.replace("</think>", "").strip()
    return cleaned


def _extract_json(text: str) -> str:
    """Extract JSON object from text that may have extra content."""
    text = _strip_thinking_tags(text)
    if not text:
        return ""
    
    # Code fences
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        return match.group(1).strip()
    
    # Balanced brace extraction (string-aware)
    start = text.find('{')
    if start == -1:
        return text.strip()
    
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(text)):
        c = text[i]
        if esc:
            esc = False
            continue
        if c == '\\':
            esc = True
            continue
        if c == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
    
    # Unbalanced — try to close
    result = text[start:]
    while depth > 0:
        result += '}'
        depth -= 1
    return result


async def _retry_on_429(client, url, headers, payload, max_retries=5):
    """API call with rate-limit retry."""
    for attempt in range(max_retries):
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code != 429:
            return resp
        try:
            msg = resp.json().get("error", {}).get("message", "")
            m = re.search(r"try again in ([\d.]+)s", msg)
            wait = float(m.group(1)) + 1.0 if m else 3.0 * (attempt + 1)
        except Exception:
            wait = 3.0 * (attempt + 1)
        wait = min(wait, 60.0)
        logger.warning(f"Rate limited ({attempt+1}/{max_retries}), waiting {wait:.1f}s")
        await asyncio.sleep(wait)
    
    raise HTTPException(status_code=429, detail="AI service busy. Please wait and try again.")


async def call_groq(prompt: str, temperature: float = 0.7, max_tokens: int = 2048) -> dict:
    """Call Groq API and return parsed JSON. Uses json_object mode for guaranteed valid JSON."""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="LLM API key not configured.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    
    content = ""
    for attempt in range(2):
        try:
            payload = {
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": _SYSTEM_MSG},
                    {"role": "user", "content": prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            # Attempt 1: json_object mode (works reliably with non-thinking models)
            # Attempt 2: without it (fallback)
            if attempt == 0:
                payload["response_format"] = {"type": "json_object"}

            async with httpx.AsyncClient(timeout=60) as client:
                resp = await _retry_on_429(client, url, headers, payload)
                resp.raise_for_status()
                content = resp.json()["choices"][0]["message"]["content"]
                cleaned = _extract_json(content)
                if not cleaned:
                    raise json.JSONDecodeError("Empty after extraction", content, 0)
                result = json.loads(cleaned)
                logger.info(f"JSON parsed OK (attempt {attempt+1}), keys: {list(result.keys())}")
                return result

        except HTTPException:
            raise
        except httpx.HTTPStatusError as e:
            body = e.response.text
            logger.warning(f"Groq attempt {attempt+1} HTTP error: {body[:200]}")
            if "json_validate_failed" in body and attempt == 0:
                logger.info("Retrying without response_format...")
                continue
            raise HTTPException(status_code=502, detail="Upstream AI error.")
        except json.JSONDecodeError as e:
            if attempt == 0:
                logger.warning(f"JSON parse failed attempt {attempt+1}: {content[:200]}")
                continue
            logger.error(f"JSON parse failed: {str(e)}, content: {content[:300]}")
            return {
                "title": "Generation Error",
                "subtitle": "Please try again",
                "sections": [{"type": "concept", "title": "Error", "content": "AI returned invalid format. Please try again.", "speak_text": "Please try again."}],
                "summary": "Error occurred.", "key_terms": []
            }
        except httpx.RequestError:
            raise HTTPException(status_code=504, detail="AI provider timeout.")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error.")

    raise HTTPException(status_code=502, detail="AI error after retries.")


async def call_groq_text(prompt: str, temperature: float = 0.7, max_tokens: int = 256) -> str:
    """Call Groq API and return plain text."""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="LLM API key not configured.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await _retry_on_429(client, url, headers, {
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a helpful educational assistant. Answer directly."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
            })
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()
            return _strip_thinking_tags(content) or content
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"call_groq_text error: {str(e)}")
        return "I'm having trouble right now. Please try again."


async def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm", content_type: str = "audio/webm") -> str:
    """Transcribe audio using Whisper via Groq API."""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="LLM API key not configured.")
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                files={"file": (filename, audio_bytes, content_type)},
                data={"model": WHISPER_MODEL, "language": "en", "response_format": "json"},
            )
            resp.raise_for_status()
            return resp.json().get("text", "")
    except Exception as e:
        logger.error(f"Transcribe error: {str(e)}")
        return ""
