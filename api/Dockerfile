FROM python:3.8-slim-buster

WORKDIR /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

RUN apt-get update && \
    apt-get install curl -y && \
    curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry

ARG INSTALL_DEV=false
COPY ./pyproject.toml ./poetry.lock* /app/
RUN cd /app && \
    poetry config virtualenvs.create false && \
    bash -c "if [ $INSTALL_DEV == 'true' ] ; then poetry install --no-root ; else poetry install --no-root --no-dev ; fi" && \
    rm -rf /root/.cache/pypoetry /var/lib/apt/lists/*

COPY . .

EXPOSE 8000
CMD /wait && /app/start.sh
