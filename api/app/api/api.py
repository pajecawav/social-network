from fastapi import APIRouter

from app.api.endpoints import friends, login, users

api_router = APIRouter()

api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(friends.router, prefix="/friends", tags=["friends"])
