# Dockerfile for a production Next.js app
# This version uses Bun for fast dependency installation and npm for building.

# --- Stage 1: Install Dependencies with Bun ---
# This stage uses the official Bun image for its fast installer.
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy only the necessary package manager files
COPY package.json package-lock.json* bun.lockb* ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# --- Stage 2: Build ---
# This stage builds the Next.js application using npm.
FROM node:23-alpine3.20 AS build
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the package.json to ensure build scripts are available
COPY package.json .

# Copy the rest of your source code
COPY . .

# Build-time args (only needed during the build)
ARG DATABASE_URL
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ARG NEXT_PUBLIC_APP_URL

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# ✅ Run type-check and lint before building
RUN npm run check-types && npm run lint

# Build the Next.js app using npm
RUN npm run build

# --- Stage 3: Production ---
# This is the final, small image that will be deployed.
FROM node:23-alpine3.20 AS production

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the standalone output from the 'build' stage
# This includes only the files needed to run the app in production.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./

# Copy the public and static folders
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Note: Runtime secrets (like DATABASE_URL) are now provided by Kubernetes,
# so they are not needed here.

EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]
