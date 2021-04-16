#!/bin/sh

# exit in case of an error
set -e

docker-compose down --remove-orphans

docker-compose build --build-arg INSTALL_DEV=true db api
docker-compose up -d db api
docker-compose exec -T api pytest --cov=app --cov-report=term-missing app/tests "${@}"
docker-compose down --remove-orphans
