"""add more user information fields

Revision ID: 17b638a48bad
Revises: 24b30afc50ac
Create Date: 2021-05-14 16:30:08.325376

"""
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "17b638a48bad"
down_revision = "24b30afc50ac"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_info",
        sa.Column("user_info_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column(
            "gender",
            postgresql.ENUM("male", "female", name="gender_enum", create_type=False),
            nullable=True,
        ),
        sa.Column("birthdate", sa.Date(), nullable=True),
        sa.Column("relationship_status", sa.String(), nullable=True),
        sa.Column("country", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("website", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("user_info_id"),
    )
    op.add_column("users", sa.Column("user_info_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "users_user_info_id_fkey",
        "users",
        "user_info",
        ["user_info_id"],
        ["user_info_id"],
    )
    op.drop_column("users", "birthdate")
    op.drop_column("users", "gender")
    op.drop_column("users", "status")


def downgrade():
    op.add_column(
        "users", sa.Column("status", sa.VARCHAR(), autoincrement=False, nullable=True)
    )
    op.add_column(
        "users",
        sa.Column(
            "gender",
            postgresql.ENUM("male", "female", name="gender_enum"),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "users", sa.Column("birthdate", sa.DATE(), autoincrement=False, nullable=True)
    )
    op.drop_constraint("users_user_info_id_fkey", "users", type_="foreignkey")
    op.drop_column("users", "user_info_id")
    op.drop_table("user_info")
