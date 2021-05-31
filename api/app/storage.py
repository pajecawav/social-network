from app.config import settings


def save_file(file, filename: str) -> None:
    full_path = settings.FILE_STORAGE_ROOT / filename
    with open(full_path, "wb") as out_file:
        out_file.write(file.read())


def delete_file(filename: str) -> None:
    full_path = settings.FILE_STORAGE_ROOT / filename
    full_path.unlink()
