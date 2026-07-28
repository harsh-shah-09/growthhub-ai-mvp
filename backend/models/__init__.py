# Import all models here so Alembic can discover them during autogenerate
from core.database import Base
from .user import User
from .career import Job, Internship, CodingChallenge
from .roadmap import Roadmap
from .portfolio import Portfolio
from .chat_history import ChatHistory
