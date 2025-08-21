FROM node:23-alpine3.20

WORKDIR /app

# Copy dependency files and install
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm i --force

# Copy all source code
COPY . .

# Build-time args
ARG DATABASE_URL
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ARG NEXT_PUBLIC_BASE_URL

# Environment variables
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NODE_ENV=production
ENV PORT=3000

# Build Next.js
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Switch to standalone folder
WORKDIR /app/.next/standalone
USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
# Run the standalone server
CMD ["node", "server.js"]
