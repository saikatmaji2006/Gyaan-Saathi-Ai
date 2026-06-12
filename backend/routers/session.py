from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Session"])

# In-memory session store for prototype
sessions_store = {}


@router.get("/sessions")
async def get_sessions():
    """List all sessions."""
    sessions_list = list(sessions_store.values())
    sessions_list.sort(key=lambda s: s.get("created_at", ""), reverse=True)
    return {"sessions": sessions_list}


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get a specific session by ID."""
    if session_id in sessions_store:
        return sessions_store[session_id]
    return {"id": session_id, "topic": "Unknown", "lessons": [], "quizzes": []}


@router.post("/session")
async def save_session(session: dict):
    """Save a session."""
    session_id = session.get("id", "")
    if session_id:
        sessions_store[session_id] = session
    return {"status": "saved", "id": session_id}
