from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    company = Column(String(255), index=True, nullable=False)
    location = Column(String(255))
    url = Column(Text, nullable=False)
    job_type = Column(String(50)) # Full-time, Part-time
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    company = Column(String(255), index=True, nullable=False)
    stipend = Column(String(100))
    url = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CodingChallenge(Base):
    __tablename__ = "coding_challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    difficulty = Column(String(50)) # Easy, Medium, Hard
    company_tag = Column(String(100), index=True)
    description = Column(Text, nullable=False)