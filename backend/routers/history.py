from typing import cast

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database import get_db
from models import ScanHistory, User

from routers.auth import get_current_user


router = APIRouter(
    prefix="/history",
    tags=["History"],
)


# ==========================================
# GET USER HISTORY
# ==========================================

@router.get("/")
def history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == current_user.id
        )
        .order_by(
            ScanHistory.scanned_at.desc()
        )
        .all()
    )


# ==========================================
# HISTORY STATS
# ==========================================

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history_items = (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == current_user.id
        )
        .all()
    )

    total = len(history_items)

    safe = sum(
        1
        for item in history_items
        if cast(str, item.prediction) == "Legitimate"
    )

    threats = sum(
        1
        for item in history_items
        if cast(str, item.prediction) == "Phishing"
    )

    total_risk = sum(
        cast(float, item.final_score or 0)
        for item in history_items
    )

    average_risk = (
        round(total_risk / total, 2)
        if total > 0
        else 0
    )

    return {
        "total_scans": total,
        "safe_urls": safe,
        "threats": threats,
        "average_risk": average_risk,
    }


# ==========================================
# DELETE ONE ITEM
# ==========================================

@router.delete("/{history_id}")
def delete_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = (
        db.query(ScanHistory)
        .filter(
            ScanHistory.id == history_id,
            ScanHistory.user_id == current_user.id,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="History item not found.",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "History item deleted successfully."
    }


# ==========================================
# DELETE ALL USER HISTORY
# ==========================================

@router.delete("/")
def delete_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    (
        db.query(ScanHistory)
        .filter(
            ScanHistory.user_id == current_user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    db.commit()

    return {
        "message": "History cleared successfully."
    }