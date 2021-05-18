from enum import Enum
from typing import Optional

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api.dependencies import get_current_user, get_current_user_or_none, get_db

router = APIRouter()


class FriendsOrderEnum(str, Enum):
    ids = "ids"
    random = "random"


@router.get(
    "", response_model=schemas.FriendsPaginationOut, response_model_exclude_none=True
)
def get_friends(
    user_id: Optional[int] = None,
    limit: Optional[int] = None,
    cursor: Optional[int] = None,
    order_by: FriendsOrderEnum = FriendsOrderEnum.ids,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_or_none),
):
    if user_id is None:
        if current_user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User id or token is required.",
            )
        else:
            user = current_user
    else:
        user = crud.user.get_or_404(db, user_id)

    if order_by == FriendsOrderEnum.ids:
        order_expr = models.User.user_id
    elif order_by == FriendsOrderEnum.random:
        order_expr = func.random()
    else:
        assert False

    q = user.friends.order_by(order_expr)

    total_matches = q.count()

    if cursor is not None:
        q = q.filter(models.User.user_id >= cursor)

    if limit is not None:
        q = q.limit(limit + 1)

    friends = q.all()
    next_cursor = (
        friends.pop().user_id
        if (limit is not None and len(friends) == (limit + 1))
        else None
    )

    return {
        "total_matches": total_matches,
        "friends": friends,
        "next_cursor": next_cursor,
    }


@router.post("", response_model=schemas.User)
def add_friend(
    user_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can't add yourself as friend.",
        )

    other_user = crud.user.get_or_404(db, user_id)

    existing_friend = other_user.friends.filter(
        models.User.user_id == current_user.user_id
    ).first()
    if existing_friend is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already friends with this user.",
        )

    crud.user.add_friend(db, user=other_user, friend=current_user)
    db.refresh(other_user)

    return other_user


@router.delete("")
def delete_friend(
    user_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    other_user = crud.user.get_or_404(db, user_id)

    existing_friend = other_user.friends.filter(
        models.User.user_id == current_user.user_id
    ).first()
    if existing_friend is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not friends with user.",
        )

    crud.user.remove_friend(db, user=other_user, friend=current_user)

    return JSONResponse()
