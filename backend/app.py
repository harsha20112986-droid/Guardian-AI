from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers.history import router as history_router
from routers.url import router as url_router
from routers.qr import router as qr_router
from routers.sms import router as sms_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Guardian AI API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(url_router)
app.include_router(history_router)
app.include_router(qr_router)
app.include_router(sms_router)


@app.get("/")
def home():
    return {
        "message": "Guardian AI Backend Running"
    }