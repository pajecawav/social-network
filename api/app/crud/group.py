from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.models import Group, User
from app.schemas import GroupCreate, GroupUpdate

from .base import CRUDBase


class CRUDGroup(CRUDBase[Group, GroupCreate, GroupUpdate]):
    def create(  # type: ignore
        self, db: Session, group_in: GroupCreate, *, admin: User
    ) -> Group:
        group = Group(**jsonable_encoder(group_in), admin_id=admin.user_id)

        group.users.append(admin)

        db.add(group)
        db.commit()
        db.refresh(group)

        return group


group = CRUDGroup(Group)
