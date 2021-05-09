"""add optional target user to chat action

Revision ID: 24b30afc50ac
Revises: 1adaa2a9bbc0
Create Date: 2021-05-09 18:21:17.077342

"""
import sqlalchemy as sa

from alembic import op

revision = "24b30afc50ac"
down_revision = "1adaa2a9bbc0"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "chat_actions", sa.Column("towards_user_id", sa.Integer(), nullable=True)
    )
    op.create_foreign_key(
        "chat_actions_towards_user_id_fkey",
        "chat_actions",
        "users",
        ["towards_user_id"],
        ["user_id"],
    )
    op.execute("ALTER TYPE chat_action_type_enum ADD VALUE 'invite'")
    op.execute("ALTER TYPE chat_action_type_enum ADD VALUE 'leave'")
    op.execute("ALTER TYPE chat_action_type_enum ADD VALUE 'kick'")


def downgrade():
    op.drop_constraint(
        "chat_actions_towards_user_id_fkey", "chat_actions", type_="foreignkey"
    )
    op.drop_column("chat_actions", "towards_user_id")
    op.execute(
        """
        DELETE FROM pg_enum
            WHERE enumlabel IN ('invite', 'leave', 'kick')
            AND enumtypid = (
                SELECT oid FROM pg_type WHERE typname = 'chat_action_type_enum'
            )
        """
    )
