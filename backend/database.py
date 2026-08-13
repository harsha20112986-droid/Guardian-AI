import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# DATABASE CONFIGURATION
# ==========================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///guardian_ai.db",
)


# ==========================================
# DATABASE ENGINE
# ==========================================

if DATABASE_URL.startswith("sqlite"):
    connect_args = {
        "check_same_thread": False,
    }
else:
    connect_args = {}


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)


# ==========================================
# SESSION
# ==========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ==========================================
# BASE MODEL
# ==========================================

Base = declarative_base()


# ==========================================
# DATABASE DEPENDENCY
# ==========================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()