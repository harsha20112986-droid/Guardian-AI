from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import User
from routers.auth import get_current_user

from services.ai_chatbot import (
    generate_response,
)


router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"],
)


# ==========================================
# REQUEST SCHEMAS
# ==========================================

class ChatMessage(BaseModel):
    role: str
    content: str


class AssistantRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
    )

    conversation_history: Optional[
        List[ChatMessage]
    ] = None


# ==========================================
# CHAT ENDPOINT
# ==========================================

@router.post("/chat")
def assistant_chat(
    request: AssistantRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    try:
        history = []

        if request.conversation_history:
            history = [
                {
                    "role": item.role,
                    "content": item.content,
                }
                for item in request.conversation_history
            ]

        response = generate_response(
            message=request.message,
            conversation_history=history,
        )

        return {
            "success": True,
            "response": response,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except RuntimeError as error:
        print(
            "Assistant service error:",
            error,
        )

        raise HTTPException(
            status_code=503,
            detail=str(error),
        )

    except Exception as error:
        print(
            "Unexpected assistant error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="AI Assistant request failed.",
        )