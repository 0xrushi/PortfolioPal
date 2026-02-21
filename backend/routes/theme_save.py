import datetime
import json
import os
import shutil
from pathlib import Path

from fastapi import APIRouter, Depends
from fastapi.security import HTTPBasicCredentials
from pydantic import BaseModel

from routes.portfolio import security, verify_admin

router = APIRouter(prefix="/api/themes", tags=["themes"])

# Inside Docker the data dir is /app/data (mounted as a volume).
# Outside Docker it resolves relative to this file.
_APP_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get("DATA_DIR", str(_APP_DIR / "data")))
THEMES_DIR = DATA_DIR / "themes"
HISTORY_FILE = DATA_DIR / "history.json"

# my-portfolio/public — overridable via env so Docker can mount it anywhere.
PORTFOLIO_PUBLIC_DIR = Path(
    os.environ.get(
        "PORTFOLIO_PUBLIC_DIR", str(_APP_DIR.parent / "my-portfolio" / "public")
    )
)


class ApplyRequest(BaseModel):
    code: str
    theme_name: str = "untitled"


class ApplyResponse(BaseModel):
    files_written: list[str]
    backup_path: str


class LogRequest(BaseModel):
    code: str
    theme_name: str = "untitled"
    saved: bool = False


class HistoryEntry(BaseModel):
    id: str
    theme_name: str
    generated_at: str
    saved: bool
    code: str


def _normalize_history_entry(entry: dict) -> dict | None:
    # Backward/forward compatibility: tolerate older history formats.
    # If we cannot produce something previewable, skip the entry.
    code = entry.get("code")
    if not isinstance(code, str) or not code.strip():
        snippet = entry.get("preview_snippet")
        if isinstance(snippet, str) and snippet.strip():
            code = snippet
        else:
            return None

    generated_at = entry.get("generated_at")
    if not isinstance(generated_at, str) or not generated_at.strip():
        applied_at = entry.get("applied_at")
        if isinstance(applied_at, str) and applied_at.strip():
            generated_at = applied_at
        else:
            generated_at = datetime.datetime.now().isoformat()

    saved = entry.get("saved")
    if not isinstance(saved, bool):
        saved = bool(entry.get("applied_at"))

    theme_name = entry.get("theme_name")
    if not isinstance(theme_name, str) or not theme_name.strip():
        theme_name = "untitled"

    entry_id = entry.get("id")
    if not isinstance(entry_id, str) or not entry_id.strip():
        entry_id = datetime.datetime.now().strftime("%Y%m%d_%H%M%S%f")

    return {
        "id": entry_id,
        "theme_name": theme_name,
        "generated_at": generated_at,
        "saved": saved,
        "code": code,
    }


def _load_history() -> list[dict]:
    if not HISTORY_FILE.exists():
        return []
    try:
        return json.loads(HISTORY_FILE.read_text())
    except Exception:
        return []


def _save_history(entries: list[dict]) -> None:
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_FILE.write_text(json.dumps(entries, indent=2))


def _append_entry(theme_name: str, code: str, saved: bool) -> str:
    entries = _load_history()
    entry_id = datetime.datetime.now().strftime("%Y%m%d_%H%M%S%f")
    entries.append(
        {
            "id": entry_id,
            "theme_name": theme_name,
            "generated_at": datetime.datetime.now().isoformat(),
            "saved": saved,
            "code": code,
        }
    )
    _save_history(entries)
    return entry_id


def _mark_saved(entry_id: str) -> None:
    entries = _load_history()
    for e in entries:
        if e["id"] == entry_id:
            e["saved"] = True
            e["theme_name"] = e.get("theme_name", "untitled")
    _save_history(entries)


@router.get("/current")
async def get_current_portfolio() -> dict:
    index_file = PORTFOLIO_PUBLIC_DIR / "index.html"
    if not index_file.exists():
        return {"html": None}
    return {"html": index_file.read_text()}


@router.post("/log")
async def log_generation(request: LogRequest) -> dict:
    entry_id = _append_entry(request.theme_name, request.code, request.saved)
    return {"id": entry_id}


@router.post("/apply", response_model=ApplyResponse)
async def apply_to_portfolio(
    request: ApplyRequest,
    _credentials: HTTPBasicCredentials = Depends(security),
    _auth: None = Depends(verify_admin),
) -> ApplyResponse:
    PORTFOLIO_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    # Backup existing index.html
    index_file = PORTFOLIO_PUBLIC_DIR / "index.html"
    backup_path = ""
    if index_file.exists():
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = THEMES_DIR / f"_backup_{timestamp}"
        backup_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(index_file, backup_dir / "index.html")
        backup_path = str(backup_dir)

    index_file.write_text(request.code)

    # Log as a saved entry
    _append_entry(request.theme_name, request.code, saved=True)

    return ApplyResponse(files_written=["public/index.html"], backup_path=backup_path)


@router.get("/history", response_model=list[HistoryEntry])
async def get_history() -> list[HistoryEntry]:
    entries = _load_history()
    result: list[HistoryEntry] = []
    for e in entries:
        if not isinstance(e, dict):
            continue
        normalized = _normalize_history_entry(e)
        if not normalized:
            continue
        try:
            result.append(HistoryEntry(**normalized))
        except Exception:
            continue
    return result


@router.delete("/history/{entry_id}")
async def delete_history_entry(
    entry_id: str,
    _credentials: HTTPBasicCredentials = Depends(security),
    _auth: None = Depends(verify_admin),
) -> dict:
    entries = _load_history()
    entries = [e for e in entries if e["id"] != entry_id]
    _save_history(entries)
    return {"ok": True}
