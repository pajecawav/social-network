#!/bin/sh

alembic upgrade head
python -m app.db.init_db
uvicorn --reload --host 0.0.0.0 --root-path "/api" app.main:app $@
