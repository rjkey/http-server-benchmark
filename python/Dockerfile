FROM alpine:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the application files to the container
COPY ./src/ /app
COPY requirements.txt /app

# Install dependencies
RUN apk update
RUN apk add python3
RUN apk add py3-pip

RUN pip install -r requirements.txt

# Expose the necessary port
EXPOSE 8000

# Start the application
CMD ["python", "server.py"]
