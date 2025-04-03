FROM python:3.11-alpine AS builder

WORKDIR /app

RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    python3-dev

RUN python -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir gunicorn && \
    pip install --no-cache-dir -r requirements.txt && \
    rm -rf /tmp/*


FROM python:3.11-alpine

WORKDIR /app

RUN apk add --no-cache \
    libstdc++ \
    openblas \
    libgomp

COPY --from=builder /app/.venv /app/.venv
COPY . .

ENV PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

EXPOSE 5000

CMD ["gunicorn", "wsgi:app", "-b", "0.0.0.0:5000"]