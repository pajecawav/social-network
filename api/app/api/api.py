from fastapi import APIRouter

from app.api.endpoints import chats, friends, login, users

api_router = APIRouter()

api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(friends.router, prefix="/friends", tags=["friends"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
