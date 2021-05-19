"""add file table

Revision ID: 820110107520
Revises: 72588739e54d
Create Date: 2021-05-19 19:24:21.558575

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "820110107520"
down_revision = "72588739e54d"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "files",
        sa.Column("file_id", postgresql.UUID(), nullable=False),
        sa.Column("file_type", sa.String(), nullable=False),
        sa.Column("ext", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("file_id"),
    )
    op.create_table(
        "images",
        sa.Column("file_id", postgresql.UUID(), nullable=False),
        sa.ForeignKeyConstraint(
            ["file_id"],
            ["files.file_id"],
        ),
        sa.PrimaryKeyConstraint("file_id"),
    )
    op.add_column("users", sa.Column("avatar_id", postgresql.UUID(), nullable=True))
    op.create_foreign_key(
        "users_avatar_id_fkey", "users", "images", ["avatar_id"], ["file_id"]
    )


def downgrade():
    op.drop_constraint("users_avatar_id_fkey", "users", type_="foreignkey")
    op.drop_column("users", "avatar_id")
    op.drop_table("images")
    op.drop_table("files")
