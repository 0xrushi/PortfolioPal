import json
import os
import threading
from datetime import date
from pathlib import Path
from typing import TypedDict


DEFAULT_DAILY_ATTEMPT_LIMIT = 10
_lock = threading.Lock()

_APP_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get("DATA_DIR", str(_APP_DIR / "data")))
ATTEMPTS_FILE = DATA_DIR / "daily_attempts.json"


class DailyAttemptStats(TypedDict):
    date: str
    used: int
    limit: int
    remaining: int


def _today_iso() -> str:
    return date.today().isoformat()


def _read_state() -> dict[str, int | str]:
    today = _today_iso()
    if not ATTEMPTS_FILE.exists():
        return {"date": today, "used": 0}

    try:
        data = json.loads(ATTEMPTS_FILE.read_text())
    except Exception:
        return {"date": today, "used": 0}

    if not isinstance(data, dict):
        return {"date": today, "used": 0}

    stored_date = data.get("date")
    used = data.get("used", 0)

    if not isinstance(stored_date, str) or stored_date != today:
        return {"date": today, "used": 0}

    if not isinstance(used, int) or used < 0:
        used = 0

    return {"date": today, "used": used}


def _write_state(state: dict[str, int | str]) -> None:
    ATTEMPTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    ATTEMPTS_FILE.write_text(json.dumps(state, indent=2))


def _format_stats(state: dict[str, int | str], limit: int) -> DailyAttemptStats:
    used = int(state.get("used", 0))
    return {
        "date": str(state.get("date", _today_iso())),
        "used": used,
        "limit": limit,
        "remaining": max(0, limit - used),
    }


def get_daily_attempt_stats(
    limit: int = DEFAULT_DAILY_ATTEMPT_LIMIT,
) -> DailyAttemptStats:
    with _lock:
        state = _read_state()
        _write_state(state)
        return _format_stats(state, limit)


def record_daily_attempt(limit: int = DEFAULT_DAILY_ATTEMPT_LIMIT) -> DailyAttemptStats:
    with _lock:
        state = _read_state()
        used = int(state.get("used", 0)) + 1
        state["used"] = used
        _write_state(state)
        return _format_stats(state, limit)
