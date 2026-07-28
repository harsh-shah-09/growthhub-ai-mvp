from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

# Create the SQLAlchemy Engine
engine = create_engine(
    settings.DATABASE_URL, 
    echo=False, # Set to True to see raw SQL queries in the terminal
    future=True
)

# Create a configured "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our ORM models
Base = declarative_base()

def get_db():
    """
    Dependency generator to yield database sessions per API request.
    Ensures the connection is closed after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()