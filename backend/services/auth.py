from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.user import UserRepository
from schemas.user import UserCreate
from core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    
    @staticmethod
    def register_user(db: Session, user: UserCreate):
        # 1. Check if user already exists
        db_user = UserRepository.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # 2. Hash the password
        hashed_password = get_password_hash(user.password)
        
        # 3. Save to database
        return UserRepository.create_user(
            db=db, 
            email=user.email, 
            password_hash=hashed_password, 
            full_name=user.full_name
        )

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        # 1. Find the user
        user = UserRepository.get_user_by_email(db, email=email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # 2. Verify the password
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # 3. Generate JWT Token
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}