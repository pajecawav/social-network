from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Body, Depends, File, UploadFile, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app import crud, models, schemas, storage
from app.api import dependencies
from app.api.dependencies import get_current_user, get_current_user_or_none, get_db
from app.security import get_password_hash

router = APIRouter()


@router.post("", response_model=schemas.User, response_model_exclude_none=True)
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


@router.get(
    "", response_model=schemas.UsersPaginationOut, response_model_exclude_none=True
)
def get_users(
    query: Optional[str] = None,
    limit: int = 20,
    cursor: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.User).order_by(models.User.user_id)

    if query:
        q = q.filter(
            or_(
                models.User.first_name.ilike(f"{query}%"),
                models.User.last_name.ilike(f"{query}%"),
            )
        )

    total_matches = q.count()

    if cursor is not None:
        q = q.filter(models.User.user_id >= cursor)

    users = q.limit(limit + 1).all()
    next_cursor = users.pop().user_id if (len(users) == (limit + 1)) else None

    return {"total_matches": total_matches, "users": users, "next_cursor": next_cursor}


@router.get("/me", response_model=schemas.User, response_model_exclude_none=True)
def get_active_user(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return current_user


@router.get("/{user_id}", response_model=schemas.User, response_model_exclude_none=True)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_or_none),
):
    user = crud.user.get_or_404(db, user_id)

    response = jsonable_encoder(schemas.User.from_orm(user))

    if current_user is not None and current_user.user_id != user_id:
        response["friend_status"] = crud.user.get_friend_status(db, current_user, user)

    return response


@router.get(
    "/{user_id}/info", response_model=schemas.UserInfo, response_model_exclude_none=True
)
def get_user_info(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = crud.user.get_or_404(db, user_id)
    return user.user_info


@router.patch(
    "/{user_id}", response_model=schemas.User, response_model_exclude_none=True
)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = crud.user.get_or_404(db, user_id)
    if current_user != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your profile.",
        )
    updated_user = crud.user.update(db, object_db=user, object_update=user_update)
    return updated_user


@router.post("/{user_id}/password")
def update_password(
    user_id: int,
    new_password: str = Body(..., embed=True, min_length=1),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = crud.user.get_or_404(db, user_id)
    if current_user != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your profile.",
        )

    user.password_hashed = get_password_hash(new_password)
    db.add(user)
    db.commit()

    return JSONResponse()


@router.patch(
    "/{user_id}/info", response_model=schemas.UserInfo, response_model_exclude_none=True
)
def update_user_info(
    user_id: int,
    user_info_update: schemas.UserInfoUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = crud.user.get_or_404(db, user_id)
    if current_user != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your profile.",
        )
    updated_user_info = crud.user_info.update(
        db, user_info_db=user.user_info, user_info_update=user_info_update
    )
    return updated_user_info


@router.post("/{user_id}/avatar", response_model=schemas.Image)
def upload_user_avatar(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.avatar is not None:
        background_tasks.add_task(storage.delete_file, current_user.avatar.filename)
        db.delete(current_user.avatar)

    # TODO: support more image types
    image = models.Image(ext="jpg")
    current_user.avatar = image

    db.add(current_user)
    db.add(image)
    db.commit()
    db.refresh(image)

    # TODO: save file in the background
    storage.save_file(file.file, image.filename)

    return image


@router.get("/{user_id}/groups", response_model=List[schemas.Group])
def get_groups(user_id: int, db: Session = Depends(get_db)):
    user = crud.user.get_or_404(db, user_id)
    return user.groups.all()


@router.post("/{user_id}/groups", response_model=List[schemas.Group])
def follow_group(
    user_id: int,
    group_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only follow groups on your own profile.",
        )

    group = crud.group.get_or_404(db, group_id)

    if current_user in group.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this group.",
        )

    group.users.append(current_user)
    db.add(group)
    db.commit()

    return JSONResponse()


@router.delete("/{user_id}/groups", response_model=List[schemas.Group])
def unfollow_group(
    user_id: int,
    group_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # TODO: force transfer admin rights if admin leaves
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only unfollow groups on your own profile.",
        )

    group = crud.group.get_or_404(db, group_id)

    if current_user not in group.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not following this group.",
        )

    group.users.remove(current_user)
    db.add(group)
    db.commit()

    return JSONResponse()
