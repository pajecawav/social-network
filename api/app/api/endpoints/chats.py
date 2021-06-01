from typing import List, Set, Union

from fastapi import APIRouter, BackgroundTasks, Body, Depends, File, Query, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette import status

from app import crud, models, schemas, storage
from app.api.dependencies import get_current_user, get_db
from app.schemas.chat import ChatTypeEnum
from app.sockets import namespaces

router = APIRouter()


@router.post("", response_model=schemas.GroupChat)
def create_chat(
    chat_in: schemas.GroupChatCreate,
    background_tasks: BackgroundTasks,
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

    background_tasks.add_task(
        namespaces.chat.notify_user_new_chat,
        current_user.user_id,
        jsonable_encoder(schemas.GroupChat.from_orm(chat)),
    )

    return chat


@router.get("", response_model=List[Union[schemas.GroupChat, schemas.DirectChat]])
def get_chats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chats = (
        db.query(models.Chat, models.chat_user_association_table.c.last_seen_message_id)
        .join(models.chat_user_association_table)
        .filter(models.chat_user_association_table.c.user_id == current_user.user_id)
        .order_by(models.Chat.last_message_id.desc(), models.Chat.chat_id.desc())
        .all()
    )

    response = []
    for (chat, last_seen_message_id) in chats:
        chat.last_seen_message_id = last_seen_message_id

        # TODO: figure out a better way to return peers
        if chat.chat_type == ChatTypeEnum.direct:
            chat.peer = crud.direct_chat.get_peer(db, chat, current_user.user_id)

        response.append(chat)

    return response


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
#     return JSONResponse()


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
    background_tasks: BackgroundTasks,
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
    message = crud.message.create(
        db,
        schemas.MessageCreate(),
        user_id=current_user.user_id,
        chat_id=chat.chat_id,
        action=action,
    )
    crud.chat.set_last_message(db, chat, message)

    background_tasks.add_task(
        namespaces.chat.notify_new_message,
        chat.chat_id,
        jsonable_encoder(schemas.Message.from_orm(message)),
    )

    background_tasks.add_task(
        namespaces.chat.notify_user_new_chat,
        user_id,
        jsonable_encoder(schemas.GroupChat.from_orm(chat)),
    )

    return JSONResponse()


@router.delete("/{chat_id}/users", response_model=List[schemas.User])
def remove_chat_user(
    chat_id: int,
    background_tasks: BackgroundTasks,
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
            return JSONResponse()
        else:
            chat.admin = chat.users.first()

    if current_user != user:
        # add chat notification that user left
        action = models.ChatAction(
            chat_action_type=schemas.ChatActionTypeEnum.kick, towards_user=user
        )
    else:
        action = models.ChatAction(chat_action_type=schemas.ChatActionTypeEnum.leave)
    message = crud.message.create(
        db,
        schemas.MessageCreate(),
        user_id=current_user.user_id,
        chat_id=chat.chat_id,
        action=action,
    )
    crud.chat.set_last_message(db, chat, message)

    db.add(chat)
    db.commit()

    background_tasks.add_task(
        namespaces.chat.notify_new_message,
        chat.chat_id,
        jsonable_encoder(schemas.Message.from_orm(message)),
    )

    return JSONResponse()


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


@router.get("/{chat_id}/invite_code", response_model=schemas.GroupChatInviteCode)
def get_group_chat_invite_code(
    chat_id: int,
    reset: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.group_chat.get_or_404(db, chat_id)

    if current_user != chat.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to view this chat.",
        )

    if reset or chat.invite_code is None:
        chat.invite_code = crud.group_chat.generate_invite_code()
        db.add(chat)
        db.commit()

    return {"invite_code": chat.invite_code}


@router.delete("/{chat_id}/messages")
def delete_chat_messages(
    background_tasks: BackgroundTasks,
    chat_id: int,
    message_ids: Set[int] = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.chat.get_or_404(db, chat_id)
    messages = chat.messages.filter(models.Message.message_id.in_(message_ids)).all()
    if len(messages) != len(message_ids):
        # TODO: better error message
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Some messages were not found.",
        )

    for message in messages:
        if message.user != current_user:
            # TODO: better error message
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only delete your own messages.",
            )

    if chat.last_message in messages:
        new_last_message = (
            chat.messages.filter(~models.Message.message_id.in_(message_ids))
            .order_by(models.Message.message_id.desc())
            .first()
        )
        chat.last_message = new_last_message
        db.add(chat)

    for message in messages:
        db.delete(message)
    db.commit()

    background_tasks.add_task(
        namespaces.chat.notify_messages_deleted, chat.chat_id, list(message_ids)
    )

    return JSONResponse()


@router.post("/join", response_model=schemas.JoinGroupChatOut)
def join_chat_by_code(
    background_tasks: BackgroundTasks,
    invite: schemas.GroupChatInviteCode,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = (
        db.query(models.GroupChat)
        .filter(models.GroupChat.invite_code == invite.invite_code)
        .first()
    )

    if chat is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite code doesn't match any chat.",
        )

    # do nothing is user already is a chat participant
    if current_user in chat.users:
        return {"chat_id": chat.chat_id}

    crud.group_chat.add_user(db, chat, current_user)

    action = models.ChatAction(chat_action_type=schemas.ChatActionTypeEnum.join)
    message = crud.message.create(
        db,
        schemas.MessageCreate(),
        user_id=current_user.user_id,
        chat_id=chat.chat_id,
        action=action,
    )
    crud.chat.set_last_message(db, chat, message)

    background_tasks.add_task(
        namespaces.chat.notify_new_message,
        chat.chat_id,
        jsonable_encoder(schemas.Message.from_orm(message)),
    )

    return {"chat_id": chat.chat_id}


@router.post("/{chat_id}/avatar", response_model=schemas.Image)
def upload_group_chat_avatar(
    chat_id: int,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    chat = crud.group_chat.get_or_404(db, chat_id)

    if current_user != chat.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Don't have permission to update this chat.",
        )

    if chat.avatar is not None:
        background_tasks.add_task(storage.delete_file, chat.avatar.filename)
        db.delete(chat.avatar)

    # TODO: support more image types
    image = models.Image(ext="jpg")
    chat.avatar = image

    db.add(chat)
    db.add(image)
    db.commit()
    db.refresh(image)

    # TODO: save file in the background
    storage.save_file(file.file, image.filename)

    return image
