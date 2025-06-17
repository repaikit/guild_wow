import os
from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings(BaseSettings):
    # === App Info ===
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PROJECT_NAME: str = "GuildWow API"
    API_V1_STR: str = "/api"

    # === CORS ===
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
        "http://localhost:3000",
        "https://kickin.olym3.com",
        "https://rep-ai-kickin.vercel.app",
        "https://kickin.repai.vn/"  # Production domain
    ]

    # === MongoDB ===
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb+srv://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "repai_kickin")

    # === JWT ===
    SECRET_KEY: str = os.getenv("JWT_SECRET", "supersecret")
    ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # === Cache (nếu có dùng middleware cache) ===
    CACHE_ENABLED: bool = True
    CACHE_MAX_SIZE: int = 1000
    CACHE_TTL: int = 300
    CACHE_EXCLUDED_PATHS: List[str] = [
        "/api/ws/*",
        "/api/me",
    ]

    # === Logging ===
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # === Monitoring / Prometheus ===
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 8000

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore"
    }

# Khởi tạo global settings
settings = Settings()
