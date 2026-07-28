from sqlalchemy.orm import Session
from repositories.career import CareerRepository
from schemas.career import JobCreate, InternshipCreate

class CareerService:
    """
    Business logic layer. 
    Currently acts as a pass-through to the repository, but will later handle 
    tasks like preventing duplicate jobs, logging, or sending notifications.
    """
    
    @staticmethod
    def fetch_all_jobs(db: Session, skip: int, limit: int):
        return CareerRepository.get_jobs(db, skip, limit)

    @staticmethod
    def add_new_job(db: Session, job: JobCreate):
        return CareerRepository.create_job(db, job)

    @staticmethod
    def fetch_all_internships(db: Session, skip: int, limit: int):
        return CareerRepository.get_internships(db, skip, limit)

    @staticmethod
    def add_new_internship(db: Session, internship: InternshipCreate):
        return CareerRepository.create_internship(db, internship)
        
    @staticmethod
    def fetch_coding_challenges(db: Session, difficulty: str, skip: int, limit: int):
        return CareerRepository.get_challenges(db, difficulty, skip, limit)