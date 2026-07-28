from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 'user' or 'ai' to distinguish who sent the message
    sender_role = Column(String, nullable=False) 
    message = Column(Text, nullable=False)
    
    # Automatically logs the exact time the message was saved
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Explicit two-way relationship
    user = relationship("User", back_populates="chat_histories")