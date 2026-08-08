from typing import List

from sqlalchemy.orm import Session

from models import ScanHistory


def get_history(db: Session) -> List[ScanHistory]:
    return (
        db.query(ScanHistory)
        .order_by(ScanHistory.scanned_at.desc())
        .all()
    )


def delete_history_item(
    history_id: int,
    db: Session,
) -> bool:
    history = db.get(
        ScanHistory,
        history_id,
    )

    if history is None:
        return False

    db.delete(history)
    db.commit()

    return True


def clear_history(db: Session) -> None:
    db.query(ScanHistory).delete(
        synchronize_session=False
    )
    db.commit()