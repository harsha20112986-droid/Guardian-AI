import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base

from routers.history import router as history_router
from routers.url import router as url_router
from routers.qr import router as qr_router
from routers.sms import router as sms_router
from routers.auth import router as auth_router
from routers.admin import router as admin_router
from routers.notifications import router as notifications_router
from routers.assistant import router as assistant_router


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# DATABASE INITIALIZATION
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Guardian AI API",
    description="AI-Powered Digital Safety & Threat Detection Platform",
    version="1.0.0",
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
).rstrip("/")


allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]


if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# API ROUTES
# ==========================================

app.include_router(url_router)
app.include_router(history_router)
app.include_router(qr_router)
app.include_router(sms_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(notifications_router)
app.include_router(assistant_router)


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Guardian AI Backend Running",
        "status": "healthy",
    }