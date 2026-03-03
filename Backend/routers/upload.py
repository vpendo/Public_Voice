"""
Evidence file upload for reports. Stores files under uploads/evidence/ and returns paths.
"""
import logging
import uuid
from pathlib import Path
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from core.deps import get_current_user, CurrentUser

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Allowed MIME types and max sizes (bytes)
EVIDENCE_PHOTO_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
EVIDENCE_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
EVIDENCE_VOICE_TYPES = {"audio/mpeg", "audio/mp4", "audio/webm", "audio/ogg", "audio/wav"}
MAX_PHOTO_BYTES = 10 * 1024 * 1024   # 10 MB
MAX_VIDEO_BYTES = 50 * 1024 * 1024  # 50 MB
MAX_VOICE_BYTES = 15 * 1024 * 1024  # 15 MB


def _evidence_dir() -> Path:
    d = Path(__file__).resolve().parent.parent / "uploads" / "evidence"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _safe_suffix(filename: str, allowed: set) -> str:
    if not filename or "." not in filename:
        return ".bin"
    ext = "." + filename.rsplit(".", 1)[-1].lower()
    return ext if ext in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".mov", ".m4a", ".mp3", ".ogg", ".wav"} else ".bin"


@router.post("/evidence")
async def upload_evidence(
    current_user: Annotated[CurrentUser, Depends(get_current_user)],
    photo: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    voice: Optional[UploadFile] = File(None),
) -> dict:
    """
    Upload evidence files for a report. Auth required.
    Accepts optional photo, video, voice (one or more). Returns paths to store in report.
    Paths are relative to uploads/, e.g. "evidence/abc123.jpg".
    """
    result: dict = {"evidence_photo": None, "evidence_video": None, "evidence_voice": None}
    base_dir = _evidence_dir()

    async def save_one(
        f: UploadFile,
        kind: str,
        allowed_types: set,
        max_bytes: int,
        out_key: str,
    ) -> None:
        if not f or not f.filename:
            return
        content_type = (f.content_type or "").split(";")[0].strip().lower()
        if content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type for {kind}: {f.content_type}. Allowed: {', '.join(sorted(allowed_types))}",
            )
        body = await f.read()
        if len(body) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"{kind} file too large (max {max_bytes // (1024*1024)} MB)",
            )
        suffix = _safe_suffix(f.filename, set())
        name = f"{uuid.uuid4().hex}{suffix}"
        path = base_dir / name
        path.write_bytes(body)
        rel = f"evidence/{name}"
        result[out_key] = rel
        logger.info("Uploaded %s: %s", kind, rel)

    try:
        if photo:
            await save_one(photo, "photo", EVIDENCE_PHOTO_TYPES, MAX_PHOTO_BYTES, "evidence_photo")
        if video:
            await save_one(video, "video", EVIDENCE_VIDEO_TYPES, MAX_VIDEO_BYTES, "evidence_video")
        if voice:
            await save_one(voice, "voice", EVIDENCE_VOICE_TYPES, MAX_VOICE_BYTES, "evidence_voice")
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Evidence upload failed: %s", e)
        raise HTTPException(status_code=500, detail="Upload failed")

    return result
