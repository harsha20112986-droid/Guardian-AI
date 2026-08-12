from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, ScanHistory
from routers.auth import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    total_users = db.query(User).count()

    verified_users = (
        db.query(User)
        .filter(User.email_verified == True)
        .count()
    )

    unverified_users = (
        db.query(User)
        .filter(User.email_verified == False)
        .count()
    )

    total_scans = db.query(ScanHistory).count()

    phishing_scans = (
        db.query(ScanHistory)
        .filter(ScanHistory.prediction == "Phishing")
        .count()
    )

    legitimate_scans = (
        db.query(ScanHistory)
        .filter(ScanHistory.prediction == "Legitimate")
        .count()
    )

    high_risk_scans = (
        db.query(ScanHistory)
        .filter(ScanHistory.risk_level == "High")
        .count()
    )

    medium_risk_scans = (
        db.query(ScanHistory)
        .filter(ScanHistory.risk_level == "Medium")
        .count()
    )

    low_risk_scans = (
        db.query(ScanHistory)
        .filter(ScanHistory.risk_level == "Low")
        .count()
    )

    recent_users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .limit(10)
        .all()
    )

    recent_scans = (
        db.query(ScanHistory)
        .order_by(ScanHistory.scanned_at.desc())
        .limit(10)
        .all()
    )

    return {
        "admin": {
            "id": current_admin.id,
            "name": current_admin.name,
            "email": current_admin.email,
            "role": current_admin.role,
        },
        "statistics": {
            "total_users": total_users,
            "verified_users": verified_users,
            "unverified_users": unverified_users,
            "total_scans": total_scans,
            "phishing_scans": phishing_scans,
            "legitimate_scans": legitimate_scans,
            "high_risk_scans": high_risk_scans,
            "medium_risk_scans": medium_risk_scans,
            "low_risk_scans": low_risk_scans,
        },
        "recent_users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "email_verified": user.email_verified,
                "created_at": user.created_at,
            }
            for user in recent_users
        ],
        "recent_scans": [
            {
                "id": scan.id,
                "user_id": scan.user_id,
                "scan_type": scan.scan_type,
                "content": scan.content,
                "prediction": scan.prediction,
                "confidence": scan.confidence,
                "final_score": scan.final_score,
                "risk_level": scan.risk_level,
                "scanned_at": scan.scanned_at,
            }
            for scan in recent_scans
        ],
    }


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "email_verified": user.email_verified,
            "created_at": user.created_at,
        }
        for user in users
    ]


@router.get("/scans")
def get_scans(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    scans = (
        db.query(ScanHistory)
        .order_by(ScanHistory.scanned_at.desc())
        .all()
    )

    return [
        {
            "id": scan.id,
            "user_id": scan.user_id,
            "scan_type": scan.scan_type,
            "content": scan.content,
            "prediction": scan.prediction,
            "confidence": scan.confidence,
            "rule_score": scan.rule_score,
            "final_score": scan.final_score,
            "risk_level": scan.risk_level,
            "reasons": scan.reasons,
            "scanned_at": scan.scanned_at,
        }
        for scan in scans
    ]


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot change your own admin role.",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if user.role == "admin":
        admin_count = (
            db.query(User)
            .filter(User.role == "admin")
            .count()
        )

        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the last admin account.",
            )

        user.role = "user"

        db.commit()
        db.refresh(user)

        return {
            "message": "User role changed to user.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }

    user.role = "admin"

    db.commit()
    db.refresh(user)

    return {
        "message": "User role changed to admin.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own admin account.",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if user.role == "admin":
        admin_count = (
            db.query(User)
            .filter(User.role == "admin")
            .count()
        )

        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the last admin account.",
            )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully."
    }


@router.delete("/scans/{scan_id}")
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    scan = (
        db.query(ScanHistory)
        .filter(ScanHistory.id == scan_id)
        .first()
    )

    if scan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found.",
        )

    db.delete(scan)
    db.commit()

    return {
        "message": "Scan deleted successfully."
    }