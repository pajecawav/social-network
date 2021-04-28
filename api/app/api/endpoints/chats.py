from typing import List, Union

from fastapi import APIRouter, Depends, Response
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from starlette import status

from app import crud, models, schemas
from app.api.dependencies import get_current_user, get_db
from app.schemas.chat import ChatTypeEnum

router = APIRouter()


@router.post("", response_model=schemas.GroupChat)
def create_chat(
    chat_in: schemas.GroupChatCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.group_chat.create(db, chat_in, admin=current_user)
    return chat


@router.get("", response_model=List[Union[schemas.GroupChat, schemas.DirectChat]])
def get_chats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chats = current_user.chats.order_by(models.Chat.chat_id).all()

    # TODO: figure out a better way to return peers
    for chat in chats:
        if chat.chat_type != ChatTypeEnum.direct:
            continue
        chat.peer = crud.direct_chat.get_peer(db, chat, current_user.user_id)

    return chats


@router.get("/{chat_id}", response_model=Union[schemas.GroupChat, schemas.DirectChat])
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.chat.get_or_404(db, chat_id)

    if current_user not in chat.users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to view this chat.",
        )

    # TODO: figure out a better way to return peers
    if chat.chat_type == ChatTypeEnum.direct:
        chat.peer = crud.direct_chat.get_peer(db, chat, current_user.user_id)

    return chat


# TODO: update group chat title
# @router.patch("/{chat_id}", response_model=schemas.GroupChat)
# def update_chat(
#     chat_id: int, chat_update: schemas.GroupChatUpdate, db: Session = Depends(get_db)
# ):
#     chat = crud.group_chat.get_or_404(db, chat_id)
#     chat = crud.group_chat.update(db, object_db=chat, object_update=chat_update)
#     return chat


@router.delete("/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.chat.get_or_404(db, chat_id)

    if chat.chat_type == schemas.ChatTypeEnum.group and chat.admin != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to delete this chat.",
        )

    crud.chat.delete(db, id=chat_id)
    return Response()


@router.get("/{chat_id}/users", response_model=List[schemas.User])
def get_chat_users(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.group_chat.get_or_404(db, chat_id)

    if current_user not in chat.users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to view this chat.",
        )

    return chat.users.all()


@router.get("/{chat_id}/messages", response_model=List[schemas.Message])
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.chat.get_or_404(db, chat_id)

    if current_user not in chat.users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to view this chat.",
        )

    return chat.messages.all()
