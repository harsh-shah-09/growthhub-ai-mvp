from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from models.portfolio import Portfolio
from api.v1.dependencies import get_current_user
from models.user import User

router = APIRouter()

@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio_item(
    portfolio: PortfolioCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Add a new engineering project or research paper to the student's portfolio."""
    db_portfolio = Portfolio(
        user_id=current_user.id,
        project_title=portfolio.project_title,
        description=portfolio.description,
        github_url=portfolio.github_url,
        research_paper_link=portfolio.research_paper_link,
        tech_stack=portfolio.tech_stack
    )
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

@router.get("/", response_model=List[PortfolioResponse], status_code=status.HTTP_200_OK)
def get_my_portfolio(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Retrieve all portfolio items for the authenticated student."""
    return db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio_item(
    item_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Delete a specific portfolio item."""
    db_item = db.query(Portfolio).filter(Portfolio.id == item_id, Portfolio.user_id == current_user.id).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Portfolio item not found or unauthorized")
        
    db.delete(db_item)
    db.commit()
    return None