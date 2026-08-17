from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)

from sqlalchemy.orm import Session

from database import get_db
from models import User
from routers.auth import get_current_user
from rate_limit import rate_limit

from services.qr_detector import extract_qr_url
from services.url_scanner import scan_url


router = APIRouter(
    prefix="/scan-qr",
    tags=["QR Scanner"],
)


MAX_QR_FILE_SIZE = 5 * 1024 * 1024


@router.post(
    "/",
    dependencies=[
        Depends(
            rate_limit(
                limit=20,
                window_seconds=60,
                name="qr-scan",
            )
        )
    ],
)
async def scan_qr(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined.",
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed.",
        )

    image_bytes = await file.read(
        MAX_QR_FILE_SIZE + 1
    )

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if len(image_bytes) > MAX_QR_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="QR image must be smaller than 5 MB.",
        )

    url = extract_qr_url(image_bytes)

    if not url:
        raise HTTPException(
            status_code=400,
            detail="No QR code found in the uploaded image.",
        )

    result = scan_url(
        url,
        db,
        current_user.id,
        scan_type="QR",
    )

    return {
        "decoded_url": url,
        **result,
    }