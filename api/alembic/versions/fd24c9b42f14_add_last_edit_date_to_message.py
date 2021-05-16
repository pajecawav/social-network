"""add last edit date to message

Revision ID: fd24c9b42f14
Revises: 17b638a48bad
Create Date: 2021-05-16 09:34:54.255524

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "fd24c9b42f14"
down_revision = "17b638a48bad"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "messages", sa.Column("time_edited", sa.DateTime(timezone=True), nullable=True)
    )


def downgrade():
    op.drop_column("messages", "time_edited")
