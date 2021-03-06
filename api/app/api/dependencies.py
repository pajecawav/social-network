from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import crud, models
from app.db.database import SessionLocal
from app.security import TokenParsingError, parse_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/token")
oauth2_scheme_no_error = OAuth2PasswordBearer(tokenUrl="login/token", auto_error=False)


def get_db() -> Generator[Session, None, None]:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    try:
        token_data = parse_token(token)
    except TokenParsingError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user


def get_current_user_or_none(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme_no_error),
) -> Optional[models.User]:
    if token is None:
        return None

    try:
        token_data = parse_token(token)
    except TokenParsingError:
        return None

    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user
