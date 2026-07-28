from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ChatHistoryBase(BaseModel):
    sender_role: str  # e.g., "user" or "ai"
    message: str

class ChatHistoryCreate(ChatHistoryBase):
    pass

class ChatHistoryResponse(ChatHistoryBase):
    id: int
    user_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)