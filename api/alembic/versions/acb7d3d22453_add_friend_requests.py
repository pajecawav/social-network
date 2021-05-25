"""add friend requests

Revision ID: acb7d3d22453
Revises: 820110107520
Create Date: 2021-05-25 12:13:45.426053

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "acb7d3d22453"
down_revision = "820110107520"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "friend_requests_association",
        sa.Column("from_user_id", sa.Integer(), nullable=False),
        sa.Column("to_user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["from_user_id"],
            ["users.user_id"],
        ),
        sa.ForeignKeyConstraint(
            ["to_user_id"],
            ["users.user_id"],
        ),
    )
    op.alter_column(
        "chat_user_association", "chat_id", existing_type=sa.INTEGER(), nullable=False
    )
    op.alter_column(
        "chat_user_association", "user_id", existing_type=sa.INTEGER(), nullable=False
    )
    op.alter_column(
        "friends_association",
        "first_user_id",
        existing_type=sa.INTEGER(),
        nullable=False,
    )
    op.alter_column(
        "friends_association",
        "second_user_id",
        existing_type=sa.INTEGER(),
        nullable=False,
    )


def downgrade():
    op.alter_column(
        "friends_association",
        "second_user_id",
        existing_type=sa.INTEGER(),
        nullable=True,
    )
    op.alter_column(
        "friends_association",
        "first_user_id",
        existing_type=sa.INTEGER(),
        nullable=True,
    )
    op.alter_column(
        "chat_user_association", "user_id", existing_type=sa.INTEGER(), nullable=True
    )
    op.alter_column(
        "chat_user_association", "chat_id", existing_type=sa.INTEGER(), nullable=True
    )
    op.drop_table("friend_requests_association")
