from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from core.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Fields tailored for engineering and higher ed projects
    project_title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    github_url = Column(String, nullable=True)
    research_paper_link = Column(String, nullable=True)
    tech_stack = Column(String, nullable=True)
    
    # Explicit two-way relationship
    user = relationship("User", back_populates="portfolios")