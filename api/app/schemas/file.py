from enum import Enum

from pydantic import UUID4, BaseModel


class FileTypeEnum(str, Enum):
    image = "image"

    class Config:
        orm_mode = True


class File(BaseModel):
    file_id: UUID4
    file_type: FileTypeEnum
    full_name: str


class Image(File):
    class Config:
        orm_mode = True
