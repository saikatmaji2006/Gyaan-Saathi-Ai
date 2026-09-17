import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "whisper-large-v3")
TTS_VOICE = os.getenv("TTS_VOICE", "hi-IN-SwaraNeural")
TTS_VOICE_ENGLISH = os.getenv("TTS_VOICE_ENGLISH", "en-IN-NeerjaNeural")
AUDIO_CACHE_DIR = os.getenv("AUDIO_CACHE_DIR", "audio_cache")
# Allowed origins for CORS (Vercel, Render, local dev)
_default_origins = [
    "https://gyaan-saathi-ai.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]
_env_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
ALLOWED_ORIGINS = list(dict.fromkeys(_default_origins + _env_origins)) if _env_origins else _default_origins
