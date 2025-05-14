FROM python:3.11.3-alpine

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 3002

CMD ["fastapi", "run", "main.py", "--port", "3002"]