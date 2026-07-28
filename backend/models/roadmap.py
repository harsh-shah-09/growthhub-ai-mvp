from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship # <-- Add this import
from core.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Add this new line:
    user = relationship("User", back_populates="roadmaps")

    target_career = Column(String, index=True, nullable=False)
    university = Column(String, nullable=True) 
    degree_program = Column(String, nullable=True)
    description = Column(Text, nullable=False)