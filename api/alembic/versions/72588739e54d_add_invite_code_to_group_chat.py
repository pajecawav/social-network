"""add invite code to group chat

Revision ID: 72588739e54d
Revises: fd24c9b42f14
Create Date: 2021-05-18 20:07:41.203485

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "72588739e54d"
down_revision = "fd24c9b42f14"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("group_chats", sa.Column("invite_code", sa.String(), nullable=True))
    op.execute("ALTER TYPE chat_action_type_enum ADD VALUE 'join'")


def downgrade():
    op.drop_column("group_chats", "invite_code")
    op.execute(
        """
        DELETE FROM pg_enum
            WHERE enumlabel = 'join'
            AND enumtypid = (
                SELECT oid FROM pg_type WHERE typname = 'chat_action_type_enum'
            )
        """
    )
