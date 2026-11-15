from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.roadmap import Roadmap
from api.v1.dependencies import get_current_user
from models.user import User
from services.pdf_generator import generate_roadmap_pdf
from pydantic import BaseModel

router = APIRouter()


class RoadmapCreate(BaseModel):
    target_career: str
    degree_program: str
    description: str


class RoadmapResponse(BaseModel):
    id: int
    target_career: str
    degree_program: str | None
    description: str

    class Config:
        from_attributes = True


# ✅ Fixed: GET / endpoint was missing — RoadmapScreen was 404-ing
@router.get("/", response_model=List[RoadmapResponse], status_code=status.HTTP_200_OK)
def list_roadmaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return all career roadmaps belonging to the logged-in user."""
    return (
        db.query(Roadmap)
        .filter(Roadmap.user_id == current_user.id)
        .order_by(Roadmap.id.desc())
        .all()
    )


@router.post("/", response_model=RoadmapResponse, status_code=status.HTTP_201_CREATED)
def create_roadmap(
    roadmap_in: RoadmapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually create a career roadmap for the logged-in user."""
    new_roadmap = Roadmap(
        user_id=current_user.id,
        target_career=roadmap_in.target_career,
        degree_program=roadmap_in.degree_program,
        description=roadmap_in.description,
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap


@router.get("/{roadmap_id}/export-pdf")
def export_roadmap_pdf(
    roadmap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate and stream a PDF for a specific roadmap."""
    roadmap = (
        db.query(Roadmap)
        .filter(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id)
        .first()
    )
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")

    pdf_bytes = generate_roadmap_pdf(
        target_career=roadmap.target_career,
        degree_program=roadmap.degree_program or "B.Tech Engineering",
        description=roadmap.description,
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=roadmap_{roadmap_id}.pdf"},
    )
