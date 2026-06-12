import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from config import AUDIO_CACHE_DIR, ALLOWED_ORIGINS

from routers import voice, lesson, quiz, session

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("gyaansaathi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    Path(AUDIO_CACHE_DIR).mkdir(exist_ok=True)
    logger.info("=" * 50)
    logger.info("  GyaanSaathi AI Backend")
    logger.info("  Voice-First Classroom Copilot")
    logger.info("=" * 50)

    groq_key = os.getenv("GROQ_API_KEY", "")
    if groq_key:
        logger.info(f"  [OK] GROQ_API_KEY configured ({groq_key[:8]}...)")
    else:
        logger.error("  [FAIL] GROQ_API_KEY missing — add it to backend/.env")

    try:
        import edge_tts
        logger.info("  [OK] Edge-TTS available")
    except ImportError:
        logger.error("  [FAIL] Edge-TTS not installed — run: pip install edge-tts")

    logger.info("=" * 50)

    yield

    # Shutdown
    logger.info("GyaanSaathi backend shutting down...")


app = FastAPI(
    title="GyaanSaathi AI API",
    description="Voice-First Classroom Copilot for Government Schools",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(voice.router)
app.include_router(lesson.router)
app.include_router(quiz.router)
app.include_router(session.router)


# Serve cached audio files
@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    """Serve cached TTS audio files."""
    filepath = Path(AUDIO_CACHE_DIR) / filename
    if not filepath.exists():
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Audio not found")
    return FileResponse(str(filepath), media_type="audio/mpeg")


# Health check
@app.get("/")
async def root():
    """API health check."""
    return {
        "status": "healthy",
        "service": "GyaanSaathi API"
    }


@app.get("/api/health")
async def health():
    """Detailed health check."""
    groq_key = os.getenv("GROQ_API_KEY", "")
    tts_available = False
    try:
        import edge_tts
        tts_available = True
    except ImportError:
        pass

    return {
        "status": "healthy",
        "groq_api": "configured" if groq_key else "missing",
        "tts": "available" if tts_available else "missing",
        "audio_cache": str(Path(AUDIO_CACHE_DIR).absolute()),
    }
