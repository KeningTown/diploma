FROM python:3.11.3-alpine
WORKDIR /app

# Сначала только зависимости — слой кешируется, если requirements.txt не менялся
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Теперь остальной код
COPY . /app

EXPOSE 3002
CMD ["uvicorn", "main:app", "--port", "3002"]
