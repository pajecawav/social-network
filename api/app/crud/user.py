from typing import Optional

from sqlalchemy.orm import Session

from app.models import User
from app.schemas import UserCreate, UserUpdate
from app.security import get_password_hash, verify_password

from .base import CRUDBase


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create(self, db: Session, object_in: UserCreate) -> User:
        obj = self.model(
            username=object_in.username,
            password_hashed=get_password_hash(object_in.password),
        )
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        user = db.query(self.model).filter(self.model.username == username).first()
        return user

    def authenticate(
        self, db: Session, *, username: str, password: str
    ) -> Optional[User]:
        user = self.get_by_username(db, username=username)

        if user is None:
            return None

        if not verify_password(password, user.password_hashed):
            return None

        return user


user = CRUDUser(User)
