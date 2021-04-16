#!/bin/sh

alembic upgrade head
uvicorn --workers ${NUM_WOKERS:-1} --host 0.0.0.0 --root-path "/api" app.main:app $@
