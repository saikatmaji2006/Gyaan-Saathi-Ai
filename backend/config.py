import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "whisper-large-v3")
TTS_VOICE = os.getenv("TTS_VOICE", "hi-IN-SwaraNeural")
TTS_VOICE_ENGLISH = os.getenv("TTS_VOICE_ENGLISH", "en-IN-NeerjaNeural")
AUDIO_CACHE_DIR = os.getenv("AUDIO_CACHE_DIR", "audio_cache")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "https://gyaan-saathi-ai.vercel.app").split(",")
