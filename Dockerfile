# Use the official Node.js image as a base
FROM node:23-alpine3.20 AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to avoid unnecessary npm installs during changes
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

COPY . .

COPY .env .env

# Build the Next.js application
RUN npm run build

# Expose the port your app runs on (default is 3000)
EXPOSE 3000

# Start the Next.js app
# CMD ["npm", "run", "dev"]
CMD ["npm", "run", "start"]
