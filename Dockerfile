# =============================================================================
# MCP Server Events — Dockerfile
#
# Три стейджа:
#   deps        — устанавливает зависимости (кэшируется отдельно)
#   builder     — компилирует TypeScript
#   production  — минимальный образ для запуска
# =============================================================================

# ─── Стейдж 1: DEPS ───────────────────────────────────────────────────────────
# Устанавливаем ВСЕ зависимости (включая dev).
# Отдельный стейдж нужен чтобы Docker кэшировал node_modules —
# если код изменился, но package.json нет, npm install не запускается заново.
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci


# ─── Стейдж 2: BUILDER ────────────────────────────────────────────────────────
# Компилируем TypeScript → JavaScript.
FROM node:20-alpine AS builder

WORKDIR /app

# Берём уже установленные зависимости из стейджа deps
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходники
COPY tsconfig.json ./
COPY src/          ./src/

# Компиляция
RUN npm run build


# ─── Стейдж 3: PRODUCTION ─────────────────────────────────────────────────────
# Минимальный образ — только скомпилированный код и runtime зависимости.
# Без TypeScript, tsx, @types и прочего dev-мусора.
FROM node:20-alpine AS production

WORKDIR /app

# Метаданные образа (стандарт OCI)
LABEL org.opencontainers.image.title="MCP Server Events"
LABEL org.opencontainers.image.description="MCP server for searching events via API"
LABEL org.opencontainers.image.source="https://github.com/YOUR_USERNAME/mcp-server-events"

# Устанавливаем ТОЛЬКО production зависимости
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Копируем скомпилированный код из builder
COPY --from=builder /app/build ./build

# Запускаем от непривилегированного пользователя (best practice безопасности)
USER node

ENV NODE_ENV=production

# MCP работает через stdio — никаких портов не нужно.
# Переменные API_URL и API_TOKEN передаются при запуске через --env-file или -e.
CMD ["node", "build/index.js"]
