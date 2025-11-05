# Multi-stage Dockerfile for Next.js 15 with pnpm
# Optimized for Coolify deployment

# Stage 1: Base image with pnpm
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Stage 2: Install dependencies
FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --prod=false

# Stage 3: Build the application
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN pnpm build

# Stage 4: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install curl for healthcheck (more reliable than wget for this use case)
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy startup script for debugging
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Fix ownership of startup script
RUN chown nextjs:nodejs ./start.sh

# Switch to non-root user
USER nextjs

# Expose port (default, but Coolify may use different port via PORT env var)
EXPOSE 3000

# Default values - Coolify will override these
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check that respects PORT environment variable
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

# Start Next.js server with startup script for debugging
CMD ["./start.sh"]
