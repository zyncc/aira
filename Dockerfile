# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Use npm/pnpm/yarn depending on your project
RUN npm ci --force

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

# Build Next.js app
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next.js needs this
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
