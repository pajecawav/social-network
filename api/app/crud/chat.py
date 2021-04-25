from app.crud.base import CRUDBase
from app.models import Chat
from app.schemas import ChatCreate, ChatUpdate


class CRUDChat(CRUDBase[Chat, ChatCreate, ChatUpdate]):
    pass


chat = CRUDChat(Chat)
