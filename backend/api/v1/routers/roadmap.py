from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from core.database import get_db
from models.roadmap import Roadmap
from api.v1.dependencies import get_current_user
from models.user import User
from services.pdf_generator import generate_roadmap_pdf

router = APIRouter()

@router.get("/{roadmap_id}/export-pdf")
def export_roadmap_pdf(
    roadmap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, status_text="Roadmap not found")
        
    pdf_bytes = generate_roadmap_pdf(
        target_career=roadmap.target_career,
        degree_program=roadmap.degree_program or "B.Tech Engineering",
        description=roadmap.description
    )
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=roadmap_{roadmap_id}.pdf"}
    )