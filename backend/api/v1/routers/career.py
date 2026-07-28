from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from schemas.career import JobResponse, JobCreate, InternshipResponse, InternshipCreate, CodingChallengeResponse
from services.career import CareerService

router = APIRouter()

# --- Job Endpoints ---

@router.get("/jobs", response_model=List[JobResponse], status_code=status.HTTP_200_OK)
def get_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve a list of jobs available on the platform."""
    return CareerService.fetch_all_jobs(db, skip=skip, limit=limit)

@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    """Create a new job posting."""
    return CareerService.add_new_job(db, job)

# --- Internship Endpoints ---

@router.get("/internships", response_model=List[InternshipResponse], status_code=status.HTTP_200_OK)
def get_internships(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve a list of internships."""
    return CareerService.fetch_all_internships(db, skip=skip, limit=limit)

@router.post("/internships", response_model=InternshipResponse, status_code=status.HTTP_201_CREATED)
def create_internship(internship: InternshipCreate, db: Session = Depends(get_db)):
    """Create a new internship posting."""
    return CareerService.add_new_internship(db, internship)

# --- Coding Challenge Endpoints ---

@router.get("/challenges", response_model=List[CodingChallengeResponse], status_code=status.HTTP_200_OK)
def get_coding_challenges(difficulty: str = None, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve coding challenges, optionally filtered by difficulty (Easy, Medium, Hard)."""
    return CareerService.fetch_coding_challenges(db, difficulty=difficulty, skip=skip, limit=limit)