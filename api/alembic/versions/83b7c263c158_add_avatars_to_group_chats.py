"""add avatars to group chats

Revision ID: 83b7c263c158
Revises: 97743b168b1a
Create Date: 2021-06-01 17:21:48.440570

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "83b7c263c158"
down_revision = "97743b168b1a"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "group_chats", sa.Column("avatar_id", postgresql.UUID(), nullable=True)
    )
    op.create_foreign_key(
        "group_chats_avatar_id_fkey",
        "group_chats",
        "images",
        ["avatar_id"],
        ["file_id"],
    )


def downgrade():
    op.drop_constraint("group_chats_avatar_id_fkey", "group_chats", type_="foreignkey")
    op.drop_column("group_chats", "avatar_id")
