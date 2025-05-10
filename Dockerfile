FROM python:3.10

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 👇 This tells Python how to find the src folder
ENV PYTHONPATH="${PYTHONPATH}:/code/src"

# 👇 This runs your main.py which imports from src.*
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
