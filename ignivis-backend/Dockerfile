# Backend Dockerfile for Ignivis AI
FROM python:3.10-slim

# Install system dependencies for OpenCV and PostgreSQL
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Pre-download the large model during build to avoid runtime issues on Render
# Running the utility script directly
RUN python utils/download_models.py

# Expose the port (Render uses dynamic port, but we'll use 8080 as a default)
EXPOSE 8080

# Command to run the application, using the $PORT environment variable for Render
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
