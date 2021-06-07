from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
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
    group = crud.group.create(db, group_in, admin=current_user)
    return group


@router.get("", response_model=schemas.GroupsPaginationOut)
def get_groups(
    query: Optional[str] = None,
    limit: int = 20,
    cursor: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.Group).order_by(models.Group.group_id)

    if query:
        # TODO: figure out full text search in PostgreSQL
        q = q.filter(models.Group.name.ilike(f"%{query}%"))

    total_matches = q.count()

    if cursor is not None:
        q = q.filter(models.Group.group_id >= cursor)

    groups = q.limit(limit + 1).all()
    next_cursor = groups.pop().group_id if (len(groups) == (limit + 1)) else None

    return {
        "total_matches": total_matches,
        "groups": groups,
        "next_cursor": next_cursor,
    }


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
        group_dict["is_admin"] = current_user == group.admin

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


@router.patch("/{group_id}", response_model=schemas.Group)
def update_group(
    group_id: int,
    group_update: schemas.GroupUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    group = crud.group.get_or_404(db, group_id)

    if group.admin != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an admin can update group.",
        )

    group = crud.group.update(db, object_db=group, object_update=group_update)

    return group
