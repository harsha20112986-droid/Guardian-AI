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

from services.qr_detector import extract_qr_url
from services.url_scanner import scan_url


router = APIRouter(
    prefix="/scan-qr",
    tags=["QR Scanner"],
)


@router.post("/")
async def scan_qr(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_bytes = await file.read()

    url = extract_qr_url(image_bytes)

    if not url:
        raise HTTPException(
            status_code=400,
            detail="No QR code found in the uploaded image.",
        )

    # Save QR scan under the logged-in user
    result = scan_url(
        url,
        db,
        current_user.id,
    )

    return {
        "decoded_url": url,
        **result,
    }