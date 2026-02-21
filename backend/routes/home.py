from fastapi import APIRouter
from fastapi.responses import HTMLResponse

from usage.daily_attempts import get_daily_attempt_stats


router = APIRouter()


@router.get("/")
async def get_status():
    return HTMLResponse(
        content="<h3>Your backend is running correctly. Please open the front-end URL (default is http://localhost:5173) to use screenshot-to-code.</h3>"
    )


@router.get("/api/usage/daily-attempts")
async def get_daily_attempts() -> dict[str, int | str]:
    return get_daily_attempt_stats()
