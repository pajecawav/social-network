from pydantic import BaseModel, Field


class ChatCreate(BaseModel):
    title: str = Field(..., min_length=1)


class Chat(BaseModel):
    chat_id: int
    title: str = Field(..., min_length=1)

    class Config:
        orm_mode = True


class ChatUpdate(BaseModel):
    title: str = Field(..., min_length=1)
