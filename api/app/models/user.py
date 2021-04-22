from sqlalchemy import Column, Date, ForeignKey, Integer, String, Table
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.user import GenderEnum

friends_association_table = Table(
    "friends_association",
    Base.metadata,
    Column("first_user_id", Integer, ForeignKey("users.user_id")),
    Column("second_user_id", Integer, ForeignKey("users.user_id")),
)


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hashed = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    gender = Column(
        ENUM(
            GenderEnum,
            values_callable=lambda x: [e.value for e in x],
            name="gender_enum",
        ),
        nullable=True,
    )
    birthdate = Column(Date, nullable=True)
    status = Column(String, nullable=True)

    friends = relationship(
        "User",
        secondary=friends_association_table,
        lazy="dynamic",
        primaryjoin=user_id == friends_association_table.c.first_user_id,
        secondaryjoin=user_id == friends_association_table.c.second_user_id,
        order_by="User.user_id",
    )
