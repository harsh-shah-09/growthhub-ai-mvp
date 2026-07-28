from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import Optional, List
from datetime import datetime

# --- Job Schemas ---

class JobBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    url: HttpUrl
    job_type: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Internship Schemas ---

class InternshipBase(BaseModel):
    title: str
    company: str
    stipend: Optional[str] = None
    url: HttpUrl

class InternshipCreate(InternshipBase):
    pass

class InternshipResponse(InternshipBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Coding Challenge Schemas ---

class CodingChallengeBase(BaseModel):
    title: str
    difficulty: str
    company_tag: Optional[str] = None
    description: str

class CodingChallengeCreate(CodingChallengeBase):
    pass

class CodingChallengeResponse(CodingChallengeBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)