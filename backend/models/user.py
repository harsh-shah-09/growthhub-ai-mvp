from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(50), default="student") # student, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
# ------------------------------------------------
    roadmaps = relationship("Roadmap", back_populates="user")
    portfolios = relationship("Portfolio", back_populates="user")
    chat_histories = relationship("ChatHistory", back_populates="user")