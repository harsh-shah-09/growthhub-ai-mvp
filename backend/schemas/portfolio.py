from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import Optional

class PortfolioBase(BaseModel):
    project_title: str
    description: str
    github_url: Optional[str] = None
    research_paper_link: Optional[str] = None
    tech_stack: Optional[str] = None

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioUpdate(BaseModel):
    project_title: Optional[str] = None
    description: Optional[str] = None
    github_url: Optional[str] = None
    research_paper_link: Optional[str] = None
    tech_stack: Optional[str] = None

class PortfolioResponse(PortfolioBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)