FROM python:3.10.4-buster

RUN pip install -U pip && pip install --upgrade setuptools && pip install catboost ariadne fastapi numpy uvicorn

WORKDIR /srv
COPY ./server ./


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]