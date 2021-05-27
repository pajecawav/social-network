"""add last read message to chat

Revision ID: 97743b168b1a
Revises: acb7d3d22453
Create Date: 2021-05-27 17:47:51.446968

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "97743b168b1a"
down_revision = "acb7d3d22453"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "chat_user_association",
        sa.Column("last_seen_message_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "chat_user_association_last_seend_message_id_fkey",
        "chat_user_association",
        "messages",
        ["last_seen_message_id"],
        ["message_id"],
    )


def downgrade():
    op.drop_constraint(
        "chat_user_association_last_seend_message_id_fkey",
        "chat_user_association",
        type_="foreignkey",
    )
    op.drop_column("chat_user_association", "last_seen_message_id")
