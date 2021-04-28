from typing import Any, Generic, List, Optional, Type, TypeVar

from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    DISPLAY_NAME: Optional[str] = None

    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(self.model).get(id)

    def get_or_404(self, db: Session, id: Any) -> ModelType:
        item = db.query(self.model).get(id)

        if item is None:
            display_name = self.DISPLAY_NAME or self.model.__name__

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{display_name} not found.",
            )

        return item

    def get_many(
        self, db: Session, *, offset: int = 0, limit: int = 20
    ) -> List[ModelType]:
        return db.query(self.model).offset(offset).limit(limit).all()

    def create(self, db: Session, object_in: CreateSchemaType) -> ModelType:
        obj = self.model(**jsonable_encoder(object_in))

        db.add(obj)
        db.commit()
        db.refresh(obj)

        return obj

    def update(
        self, db: Session, *, object_db: ModelType, object_update: UpdateSchemaType
    ) -> ModelType:
        old_data = jsonable_encoder(object_db)
        new_data = object_update.dict(exclude_unset=True)

        for key in old_data:
            if key in new_data:
                setattr(object_db, key, new_data[key])

        db.add(object_db)
        db.commit()
        db.refresh(object_db)

        return object_db

    def delete(self, db: Session, *, id: Any) -> None:
        object_db = self.get(db, id)
        db.delete(object_db)
        db.commit()
