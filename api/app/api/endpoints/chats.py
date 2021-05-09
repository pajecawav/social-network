from typing import List, Union

from fastapi import APIRouter, Body, Depends, Response
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

    action = models.ChatAction(chat_action_type=schemas.ChatActionTypeEnum.create)
    message = crud.message.create(
        db,
        schemas.MessageCreate(),
        user_id=current_user.user_id,
        chat_id=chat.chat_id,
        action=action,
    )

    crud.chat.set_last_message(db, chat, message)

    return chat


@router.get("", response_model=List[Union[schemas.GroupChat, schemas.DirectChat]])
def get_chats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chats = current_user.chats.order_by(
        models.Chat.last_message_id.desc(), models.Chat.chat_id.desc()
    ).all()

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


# TODO: should chat be deletable? Probably it should be automatically deleted
# when there are no more users left in chat
# @router.delete("/{chat_id}")
# def delete_chat(
#     chat_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     chat = crud.chat.get_or_404(db, chat_id)

#     if chat.chat_type == schemas.ChatTypeEnum.group and chat.admin != current_user:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Don't have permission to delete this chat.",
#         )

#     crud.chat.delete(db, id=chat_id)
#     return Response()


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


@router.post("/{chat_id}/users")
def add_chat_user(
    chat_id: int,
    user_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.group_chat.get_or_404(db, chat_id)

    if current_user not in chat.users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to view this chat.",
        )

    new_user = crud.user.get_or_404(db, user_id)

    if new_user not in current_user.friends:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only invite friends.",
        )

    if new_user in chat.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already in chat.",
        )

    chat = crud.group_chat.add_user(db, chat, new_user)

    # add chat notification that new user has been added
    action = models.ChatAction(
        chat_action_type=schemas.ChatActionTypeEnum.invite, towards_user=new_user
    )
    crud.message.create(
        db,
        schemas.MessageCreate(),
        user_id=current_user.user_id,
        chat_id=chat.chat_id,
        action=action,
    )

    return Response()


@router.delete("/{chat_id}/users", response_model=List[schemas.User])
def remove_chat_user(
    chat_id: int,
    user_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.group_chat.get_or_404(db, chat_id)
    user = crud.user.get_or_404(db, user_id)

    if current_user != chat.admin and current_user != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to remove users.",
        )

    if user not in chat.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not in the chat.",
        )

    chat = crud.group_chat.remove_user(db, chat, user)
    if chat.admin == user:
        if chat.users.count() == 0:
            crud.group_chat.delete(db, id=chat.chat_id)
        else:
            chat.admin = chat.users.first()

        db.add(chat)
        db.commit()

    if user == chat.admin:
        # add chat notification that user left
        action = models.ChatAction(
            chat_action_type=schemas.ChatActionTypeEnum.kick, towards_user=user
        )
    else:
        action = models.ChatAction(chat_action_type=schemas.ChatActionTypeEnum.leave)
    crud.message.create(
        db,
        schemas.MessageCreate(),
        user_id=current_user.user_id,
        chat_id=chat.chat_id,
        action=action,
    )

    return Response()


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

    return chat.messages.order_by(models.Message.message_id).all()
