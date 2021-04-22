from typing import Optional

from sqlalchemy.orm import Session

from app.models import User, friends_association_table
from app.schemas import UserCreate, UserUpdate
from app.security import get_password_hash, verify_password

from .base import CRUDBase


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create(self, db: Session, object_in: UserCreate) -> User:
        obj = self.model(
            username=object_in.username,
            password_hashed=get_password_hash(object_in.password),
            first_name=object_in.first_name,
            last_name=object_in.last_name,
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

    def add_friend(self, db: Session, *, user: User, friend: User) -> None:
        user.friends.append(friend)
        friend.friends.append(user)

        db.add_all([user, friend])
        db.commit()

    def remove_friend(self, db: Session, *, user: User, friend: User) -> None:
        user.friends.remove(friend)
        friend.friends.remove(user)

        db.add_all([user, friend])
        db.commit()

    def are_friends(self, db: Session, first_user_id: int, second_user_id: int) -> bool:
        friendship = (
            db.query(friends_association_table)
            .filter(
                friends_association_table.c.first_user_id == first_user_id,
                friends_association_table.c.second_user_id == second_user_id,
            )
            .first()
        )
        return friendship is not None


user = CRUDUser(User)
