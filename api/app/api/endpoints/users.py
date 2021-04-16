from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import dependencies
from app.api.dependencies import get_current_user, get_db

router = APIRouter()


@router.post("/", response_model=schemas.User)
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


@router.post("/me", response_model=schemas.User)
def users_get_current_user(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return current_user
