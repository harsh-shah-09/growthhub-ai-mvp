from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from schemas.roadmap import RoadmapCreate, RoadmapResponse
from models.roadmap import Roadmap
from api.v1.dependencies import get_current_user
from models.user import User

router = APIRouter()

@router.post("/", response_model=RoadmapResponse, status_code=status.HTTP_201_CREATED)
def create_roadmap(
    roadmap: RoadmapCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Save a new higher education and career roadmap for the logged-in student."""
    db_roadmap = Roadmap(
        user_id=current_user.id,
        target_career=roadmap.target_career,
        university=roadmap.university,
        degree_program=roadmap.degree_program,
        description=roadmap.description
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)
    return db_roadmap

@router.get("/", response_model=List[RoadmapResponse], status_code=status.HTTP_200_OK)
def get_my_roadmaps(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Retrieve all saved roadmaps specifically for the authenticated user."""
    return db.query(Roadmap).filter(Roadmap.user_id == current_user.id).all()