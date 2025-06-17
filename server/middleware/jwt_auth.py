from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from starlette.middleware.base import BaseHTTPMiddleware
from bson import ObjectId
import os

from database.database import get_users_collection

# Cấu hình JWT
SECRET_KEY = os.getenv("JWT_KEY", "default_secret_key")
ALGORITHM = "HS256"

# Những route public không cần kiểm tra token
PUBLIC_ROUTES = [
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/google",
    "/api/auth/google/callback",
    "/api/auth/google/register",
    "/api/auth/google/login",
    "/api/guest", 
    "/health", 
    "/metrics", 
    "/api/leaderboard",
    "/api/skills/",
    "/api/skills/type/kicker",
    "/api/skills/type/goalkeeper",
    "/api/users/",  # /api/users/{user_id}
    "/api/leaderboard/weekly",
    "/api/leaderboard/monthly",
    "/api/auth/verify-email",
    "/api/x/callback",
]


class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Cho phép request OPTIONS (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)

        # Cho phép các route public không cần xác thực
        if any(request.url.path.startswith(route.rstrip("/")) for route in PUBLIC_ROUTES):
            return await call_next(request)

        # Kiểm tra Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Not authorized to access this resource"})

        token = auth_header.replace("Bearer ", "")

        try:
            # Giải mã token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("_id")
            if not user_id:
                return JSONResponse(status_code=401, content={"detail": "Token missing user ID"})

            users_collection = await get_users_collection()
            user = await users_collection.find_one({"_id": ObjectId(user_id)})

            if not user:
                return JSONResponse(status_code=401, content={"detail": "User not found"})

            # Gắn user và token vào request để sử dụng sau này
            request.state.user = user
            request.state.token = token

        except JWTError:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})
        except Exception as e:
            return JSONResponse(status_code=401, content={"detail": f"Authentication failed: {str(e)}"})

        return await call_next(request)
