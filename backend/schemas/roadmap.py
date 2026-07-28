from pydantic import BaseModel, ConfigDict
from typing import Optional

class RoadmapBase(BaseModel):
    target_career: str
    university: Optional[str] = None
    degree_program: Optional[str] = None
    description: str

class RoadmapCreate(RoadmapBase):
    pass

class RoadmapResponse(RoadmapBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)