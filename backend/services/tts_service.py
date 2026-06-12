import uuid
from pathlib import Path
from config import AUDIO_CACHE_DIR, TTS_VOICE, TTS_VOICE_ENGLISH

# Ensure cache dir exists
Path(AUDIO_CACHE_DIR).mkdir(exist_ok=True)


async def generate_speech(text: str, language: str = "hi", voice: str = None) -> str | None:
    """Generate speech audio from text using Edge-TTS. Returns relative audio URL path."""
    try:
        import edge_tts
    except ImportError:
        print("edge-tts not installed. Run: pip install edge-tts")
        return None

    if not text or not text.strip():
        return None

    # Pick voice
    if voice:
        selected_voice = voice
    elif language in ("hi", "hindi"):
        selected_voice = TTS_VOICE
    elif language in ("en", "english"):
        selected_voice = TTS_VOICE_ENGLISH
    else:
        # Hinglish — use Hindi voice (handles English words fine)
        selected_voice = TTS_VOICE

    try:
        audio_id = uuid.uuid4().hex[:10]
        output_path = Path(AUDIO_CACHE_DIR) / f"{audio_id}.mp3"

        communicate = edge_tts.Communicate(text, selected_voice)
        await communicate.save(str(output_path))

        return f"/api/audio/{audio_id}.mp3"
    except Exception as e:
        print(f"TTS generation error: {e}")
        return None


async def get_available_voices(language: str = "hi-IN") -> list:
    """List available Edge-TTS voices for a language."""
    try:
        import edge_tts
        voices = await edge_tts.list_voices()
        return [v for v in voices if language in v.get("Locale", "")]
    except Exception:
        return []
