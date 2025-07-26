# Use a lightweight Node.js image
FROM node:20-alpine

# The base image doesn't have Docker, so we need to install it
# to run the 'docker compose logs' command.
RUN apk add --no-cache docker docker-cli-compose

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to leverage Docker's layer caching
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the rest of your application's source code into the container
COPY . .

# The command that will be run when the container starts
CMD ["node", "server.js"]