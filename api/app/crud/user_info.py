from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import models, schemas


class CRUDUserInfo:
    def update(
        self,
        db: Session,
        *,
        user_info_db: models.UserInfo,
        user_info_update: schemas.UserInfoUpdate
    ) -> models.UserInfo:
        old_data = jsonable_encoder(user_info_db)
        new_data = user_info_update.dict(exclude_unset=True)

        for key in old_data:
            if key in new_data:
                setattr(user_info_db, key, new_data[key])

        db.add(user_info_db)
        db.commit()
        db.refresh(user_info_db)

        return user_info_db


user_info = CRUDUserInfo()
