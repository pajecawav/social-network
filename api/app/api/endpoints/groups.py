from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api.dependencies import get_current_user, get_current_user_or_none, get_db

router = APIRouter()


@router.post("", response_model=schemas.Group)
def create_group(
    group_in: schemas.GroupCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # TODO: add pagination and filtering
    group = crud.group.create(db, group_in, admin=current_user)
    return group


@router.get("", response_model=List[schemas.Group])
def get_groups(db: Session = Depends(get_db)):
    # TODO: add pagination and filtering
    return db.query(models.Group).all()


@router.get("/{group_id}", response_model=schemas.Group)
def get_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_or_none),
):

    group = crud.group.get_or_404(db, group_id)
    group_dict = schemas.Group.from_orm(group).dict()

    if current_user is not None:
        group_dict["is_following"] = current_user in group.users

    return group_dict


@router.get("/{group_id}/users", response_model=schemas.GroupUsersPagination)
def get_group_users(
    group_id: int,
    limit: int = 6,
    db: Session = Depends(get_db),
):
    group = crud.group.get_or_404(db, group_id)

    users = group.users.order_by(func.random()).limit(limit).all()
    total_matches = group.users.count()

    return {"users": users, "total_matches": total_matches}
