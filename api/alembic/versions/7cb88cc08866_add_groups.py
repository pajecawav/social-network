"""add groups

Revision ID: 7cb88cc08866
Revises: 83b7c263c158
Create Date: 2021-06-05 13:38:33.173078

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "7cb88cc08866"
down_revision = "83b7c263c158"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "groups",
        sa.Column("group_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("short_description", sa.String(), nullable=True),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("admin_id", sa.Integer(), nullable=False),
        sa.Column("avatar_id", postgresql.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["admin_id"],
            ["users.user_id"],
        ),
        sa.ForeignKeyConstraint(
            ["avatar_id"],
            ["images.file_id"],
        ),
        sa.PrimaryKeyConstraint("group_id"),
    )
    op.create_table(
        "group_user_association",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("group_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["group_id"],
            ["groups.group_id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.user_id"],
        ),
    )


def downgrade():
    op.drop_table("group_user_association")
    op.drop_table("groups")
