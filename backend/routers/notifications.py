from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database import get_db
from models import Notification, User
from routers.auth import get_current_user


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


# ==========================================
# GET USER NOTIFICATIONS
# ==========================================

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id
        )
        .order_by(
            Notification.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "notification_type": notification.notification_type,
            "severity": notification.severity,
            "is_read": notification.is_read,
            "created_at": notification.created_at,
        }
        for notification in notifications
    ]


# ==========================================
# GET UNREAD COUNT
# ==========================================

@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
        .count()
    )

    return {
        "count": count,
    }


# ==========================================
# MARK ONE AS READ
# ==========================================

@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return {
        "message": "Notification marked as read.",
        "id": notification.id,
        "is_read": notification.is_read,
    }


# ==========================================
# MARK ALL AS READ
# ==========================================

@router.patch("/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
        .update(
            {
                Notification.is_read: True,
            },
            synchronize_session=False,
        )
    )

    db.commit()

    return {
        "message": "All notifications marked as read.",
        "updated": updated,
    }


# ==========================================
# DELETE ONE NOTIFICATION
# ==========================================

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )

    db.delete(notification)
    db.commit()

    return {
        "message": "Notification deleted successfully.",
    }