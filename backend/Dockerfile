FROM python:3.12.3-slim-bullseye

ENV POETRY_VERSION=1.8.0

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app

# Copy only requirements first for better layer caching
COPY poetry.lock pyproject.toml /app/

RUN poetry config virtualenvs.create false && poetry install

COPY ./ /app/

EXPOSE 7001

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7001"]
