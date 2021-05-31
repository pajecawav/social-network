import uuid

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base
from app.schemas import FileTypeEnum


class File(Base):
    __tablename__ = "files"

    file_id = Column(UUID, default=lambda: str(uuid.uuid4()), primary_key=True)
    file_type = Column(String, nullable=False)

    ext = Column(String, nullable=False)

    @property
    def filename(self) -> str:
        return f"{self.file_id}.{self.ext}"

    __mapper_args__ = {
        "polymorphic_identity": "files",
        "with_polymorphic": "*",
        "polymorphic_on": file_type,
    }


class Image(File):
    __tablename__ = "images"

    file_id = Column(UUID, ForeignKey("files.file_id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": FileTypeEnum.image,
        "with_polymorphic": "*",
    }
