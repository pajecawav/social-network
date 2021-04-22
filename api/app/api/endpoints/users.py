from typing import Optional

from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import dependencies
from app.api.dependencies import get_current_user, get_current_user_or_none, get_db

router = APIRouter()


@router.post("", response_model=schemas.User)
def create_user(
    user_in: schemas.UserCreate, db: Session = Depends(dependencies.get_db)
):
    if crud.user.get_by_username(db, username=user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists.",
        )

    user = crud.user.create(db, user_in)

    return user


@router.get("", response_model=schemas.UsersPaginationOut)
def get_users(
    query: Optional[str] = None,
    limit: int = 20,
    cursor: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.User)

    if cursor is not None:
        q = q.filter(models.User.user_id >= cursor)

    if query:
        q = q.filter(
            or_(
                models.User.first_name.ilike(f"{query}%"),
                models.User.last_name.ilike(f"{query}%"),
            )
        )

    total_matches = q.count()

    users = q.limit(limit + 1).all()
    next_cursor = users.pop().user_id if (len(users) == (limit + 1)) else None

    return {"total_matches": total_matches, "users": users, "next_cursor": next_cursor}


@router.get("/me", response_model=schemas.User)
def get_active_user(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return current_user


@router.get("/{user_id}", response_model=schemas.User)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_or_none),
):
    user = crud.user.get(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    response = jsonable_encoder(user)

    if current_user is not None and current_user.user_id != user_id:
        response["is_friend"] = crud.user.are_friends(db, user_id, current_user.user_id)

    return response


@router.patch("/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
):
    user = crud.user.get(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    user = crud.user.update(db, object_db=user, object_update=user_update)

    return user
