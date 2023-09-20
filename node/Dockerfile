FROM alpine:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the application files to the container
COPY ./src/ /app
COPY package.json /app

# Install dependencies
RUN apk update && apk add nodejs npm

# Install npm packages
RUN npm i

# Expose the necessary port
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]
