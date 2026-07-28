from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from schemas.chat_history import ChatHistoryCreate, ChatHistoryResponse
from models.chat_history import ChatHistory
from api.v1.dependencies import get_current_user
from models.user import User

# Import our new AI service
from services.ai_counselor import get_career_advice

router = APIRouter()

@router.post("/", response_model=List[ChatHistoryResponse], status_code=status.HTTP_201_CREATED)
def interact_with_ai_counselor(
    chat: ChatHistoryCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Save the student's message, generate AI advice, and save the AI's response."""
    
    # 1. Save the Student's message to PostgreSQL
    user_chat = ChatHistory(
        user_id=current_user.id,
        sender_role="user",
        message=chat.message
    )
    db.add(user_chat)
    db.commit()
    db.refresh(user_chat)

    # 2. Ping the LLM for intelligence
    ai_response_text = get_career_advice(chat.message)

    # 3. Save the AI's response to PostgreSQL
    ai_chat = ChatHistory(
        user_id=current_user.id,
        sender_role="ai",
        message=ai_response_text
    )
    db.add(ai_chat)
    db.commit()
    db.refresh(ai_chat)

    # 4. Return both messages to the frontend so the UI updates instantly
    return [user_chat, ai_chat]

@router.get("/", response_model=List[ChatHistoryResponse], status_code=status.HTTP_200_OK)
def get_counseling_history(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Retrieve the student's entire AI career counseling chat history, ordered by time."""
    return db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.timestamp.asc()).all()