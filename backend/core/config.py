import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

# Find the absolute path to the backend directory
# __file__ is config.py, dirname is 'core', dirname again is 'backend'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "GrowthHub AI"
    VERSION: str = "1.0.0"
    
    # Database Settings
    DATABASE_URL: str
    
    #AI Service Settings
    GEMINI_API_KEY: str
    
    # JWT Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Use the absolute path to the .env file
    model_config = SettingsConfigDict(env_file=ENV_PATH, env_file_encoding="utf-8")

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()