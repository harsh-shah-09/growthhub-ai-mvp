from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Database and Models Imports
from core.database import engine, Base
from models.user import User
from models.career import Job, Internship, CodingChallenge
from models.roadmap import Roadmap

# 2. Force table creation (this will fix the UndefinedTable error)
Base.metadata.create_all(bind=engine)

# 3. Initialize FastAPI App
app = FastAPI(title="GrowthHub AI API")

# 4. CORS Setup (crucial for mobile/frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Router Imports
from api.v1.routers.auth import router as auth_router
from api.v1.routers.career import router as career_router
from api.v1.routers.roadmap import router as roadmap_router
from api.v1.routers.portfolio import router as portfolio_router
from api.v1.routers.chat_history import router as chat_history_router

# 6. Include Routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(career_router, prefix="/api/v1/career", tags=["Career"])
app.include_router(roadmap_router, prefix="/api/v1/roadmaps", tags=["Career Roadmaps"])
app.include_router(chat_history_router, prefix="/api/v1/chat", tags=["Chat History"])
app.include_router(portfolio_router, prefix="/api/v1/portfolios", tags=["Student Portfolio"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the GrowthHub AI Backend"}