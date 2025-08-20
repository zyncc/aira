# Use Bun as base
FROM oven/bun:1 AS base
WORKDIR /app

# Accept build args
ARG DATABASE_URL
ARG NEXT_PUBLIC_BASE_URL

# Expose them as envs for build & runtime
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Install deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build Next.js
RUN bun run build

# Run as non-root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]