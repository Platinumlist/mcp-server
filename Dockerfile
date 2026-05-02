# =============================================================================
# MCP Server Events — Dockerfile
#
# Three stages:
#   deps        — installs dependencies (cached separately)
#   builder     — compiles TypeScript
#   production  — minimal runtime image
# =============================================================================

# ─── Stage 1: DEPS ───────────────────────────────────────────────────────────
# Installs ALL dependencies (including dev).
# Separate stage allows Docker to cache node_modules —
# if code changes but package.json does not, npm install is not re-run.
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci


# ─── Stage 2: BUILDER ────────────────────────────────────────────────────────
# Compiles TypeScript → JavaScript.
FROM node:20-alpine AS builder

WORKDIR /app

# Reuse already installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY tsconfig.json ./
COPY src/          ./src/

# Build step
RUN npm run build


# ─── Stage 3: PRODUCTION ─────────────────────────────────────────────────────
# Minimal image — only compiled code and runtime dependencies.
# No TypeScript, tsx, @types, or other dev dependencies.
FROM node:20-alpine AS production

WORKDIR /app

# Image metadata (OCI standard)
LABEL org.opencontainers.image.title="MCP Server Events"
LABEL org.opencontainers.image.description="MCP server for searching events via API"
LABEL org.opencontainers.image.source="https://github.com/Platinumlist/mcp-server"

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled code from builder stage
COPY --from=builder /app/build ./build

# Run as non-privileged user (security best practice)
USER node

ENV NODE_ENV=production

# MCP works via stdio — no ports needed.
# API_URL and API_TOKEN are passed via --env-file or -e at runtime.
CMD ["node", "build/index.js"]