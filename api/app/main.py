from fastapi import FastAPI

from app.api import api

app = FastAPI(title="Social Network")


app.include_router(api.api_router)
