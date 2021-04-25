from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api.dependencies import get_current_user, get_db

router = APIRouter()


@router.post("", response_model=schemas.Chat)
def create_chat(
    chat_in: schemas.ChatCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.chat.create(db, chat_in)
    return chat


@router.get("", response_model=List[schemas.Chat])
def get_chats(db: Session = Depends(get_db)):
    chats = db.query(models.Chat).all()
    return chats


@router.get("/{chat_id}", response_model=schemas.Chat)
def get_chat(chat_id: int, db: Session = Depends(get_db)):
    chat = crud.chat.get_or_404(db, chat_id)
    return chat


@router.patch("/{chat_id}", response_model=schemas.Chat)
def update_chat(
    chat_id: int, chat_update: schemas.ChatUpdate, db: Session = Depends(get_db)
):
    chat = crud.chat.get_or_404(db, chat_id)
    chat = crud.chat.update(db, object_db=chat, object_update=chat_update)
    return chat


@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(get_db)):
    _ = crud.chat.get_or_404(db, chat_id)
    crud.chat.delete(db, id=chat_id)
    return {"success": True}


@router.get("/{chat_id}/messages", response_model=List[schemas.AnyMessage])
def get_chat_messages(chat_id: int, db: Session = Depends(get_db)):
    chat = crud.chat.get_or_404(db, chat_id)

    return chat.messages.all()
