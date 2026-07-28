from sqlalchemy.orm import Session
from models.career import Job, Internship, CodingChallenge
from schemas.career import JobCreate, InternshipCreate, CodingChallengeCreate

class CareerRepository:
    
    # --- Jobs CRUD ---
    @staticmethod
    def get_jobs(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Job).order_by(Job.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create_job(db: Session, job: JobCreate):
        db_job = Job(
            title=job.title,
            company=job.company,
            location=job.location,
            url=str(job.url),
            job_type=job.job_type
        )
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        return db_job

    # --- Internships CRUD ---
    @staticmethod
    def get_internships(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Internship).order_by(Internship.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create_internship(db: Session, internship: InternshipCreate):
        db_internship = Internship(
            title=internship.title,
            company=internship.company,
            stipend=internship.stipend,
            url=str(internship.url)
        )
        db.add(db_internship)
        db.commit()
        db.refresh(db_internship)
        return db_internship

    # --- Coding Challenges CRUD ---
    @staticmethod
    def get_challenges(db: Session, difficulty: str = None, skip: int = 0, limit: int = 100):
        query = db.query(CodingChallenge)
        if difficulty:
            query = query.filter(CodingChallenge.difficulty == difficulty)
        return query.offset(skip).limit(limit).all()