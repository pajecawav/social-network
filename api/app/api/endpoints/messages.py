from typing import Optional

from fastapi.encoders import jsonable_encoder
from app.sockets.namespaces.chat import send_message_to_chat
from fastapi import APIRouter, BackgroundTasks, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api.dependencies import get_current_user, get_db

router = APIRouter()


@router.post("", response_model=schemas.Message)
def send_message(
    background_tasks: BackgroundTasks,
    message_in: schemas.MessageCreate = Body(..., alias="message"),
    chat_id: Optional[int] = Body(None),
    user_id: Optional[int] = Body(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if chat_id is None and user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST(),
            detail="Need to provide chat id or user id.",
        )

    if chat_id is not None:
        chat = crud.group_chat.get_or_404(db, chat_id)
    else:
        if user_id == current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST(),
                detail="Can't create direct chat with yourself.",
            )

        peer = crud.user.get_or_404(db, user_id)
        chat = crud.direct_chat.get_by_user_ids(
            db, first_user_id=current_user.user_id, second_user_id=peer.user_id
        )
        if chat is None:
            chat = crud.direct_chat.create(
                db, first_user=current_user, second_user=peer
            )

    message = crud.message.create(
        db, message_in, user_id=current_user.user_id, chat_id=chat.chat_id
    )
    crud.chat.set_last_message(db, chat, message)

    background_tasks.add_task(
        send_message_to_chat,
        chat.chat_id,
        jsonable_encoder(schemas.Message.from_orm(message)),
    )

    return message
