from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.user import UserCreate, UserResponse, Token
from services.auth import AuthService
from api.v1.dependencies import get_current_user
from models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new student account."""
    return AuthService.register_user(db, user)

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT access token.
    Note: Uses form-data (username/password) to comply with OAuth2 standards.
    """
    # OAuth2PasswordRequestForm maps the 'username' field to our email logic
    return AuthService.authenticate_user(db, email=form_data.username, password=form_data.password)

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """
    Fetch the profile of the currently logged-in user.
    Demonstrates how to protect an endpoint using get_current_user.
    """
    return current_user