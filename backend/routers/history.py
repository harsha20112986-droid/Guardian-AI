from typing import cast

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ScanHistory
from services.history_service import (
    clear_history,
    delete_history_item,
    get_history,
)


router = APIRouter(
    prefix="/history",
    tags=["History"],
)


@router.get("/")
def history(
    db: Session = Depends(get_db),
):
    return get_history(db)


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
):
    history_items = get_history(db)

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


@router.delete("/{history_id}")
def delete_item(
    history_id: int,
    db: Session = Depends(get_db),
):
    success = delete_history_item(
        history_id,
        db,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="History item not found",
        )

    return {
        "message": "History item deleted successfully"
    }


@router.delete("/")
def delete_all(
    db: Session = Depends(get_db),
):
    clear_history(db)

    return {
        "message": "History cleared successfully"
    }