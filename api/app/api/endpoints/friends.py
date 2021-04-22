from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api.dependencies import get_current_user, get_db

router = APIRouter()


@router.get("", response_model=List[schemas.User])
def get_friends(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return current_user.friends.all()


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

    other_user = crud.user.get(db, user_id)
    if other_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found.",
        )

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
    other_user = crud.user.get(db, user_id)
    if other_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found.",
        )

    existing_friend = other_user.friends.filter(
        models.User.user_id == current_user.user_id
    ).first()
    if existing_friend is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not friends with user.",
        )

    crud.user.remove_friend(db, user=other_user, friend=current_user)

    return Response(status_code=status.HTTP_200_OK)
