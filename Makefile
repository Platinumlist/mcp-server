# =============================================================================
# Makefile — удобные команды для работы с проектом через Docker
#
# Использование:
#   make dev          — запустить сервер в режиме разработки
#   make inspector    — открыть визуальный тест инструментов
#   make build        — собрать production образ
#   make install      — установить зависимости в Docker volume
#   make logs         — посмотреть логи dev контейнера
#   make stop         — остановить все контейнеры
#   make clean        — удалить контейнеры и volumes (сброс)
# =============================================================================

.PHONY: dev inspector build install logs stop clean help

# Запуск разработки с hot reload
dev:
	docker compose up dev

# Установить зависимости (нужно при первом запуске или после изменения package.json)
install:
	docker compose run --rm dev sh -c "npm install"

# Визуальное тестирование инструментов в браузере → http://localhost:5173
inspector:
	docker compose up inspector

# Собрать production образ
build:
	docker compose build build
	docker compose run --rm build echo "Build complete ✓"

# Посмотреть логи
logs:
	docker compose logs -f dev

# Остановить все контейнеры
stop:
	docker compose down

# Полный сброс: удалить контейнеры, образы и volume с node_modules
# Используйте если что-то сломалось или нужно обновить зависимости
clean:
	docker compose down --volumes --remove-orphans
	docker rmi mcp-server-events:dev mcp-server-events:latest 2>/dev/null || true

# Помощь
help:
	@echo ""
	@echo "  make install     Установить зависимости"
	@echo "  make dev         Запустить dev сервер с hot reload"
	@echo "  make inspector   Открыть тест инструментов → http://localhost:5173"
	@echo "  make build       Собрать production образ"
	@echo "  make logs        Логи dev контейнера"
	@echo "  make stop        Остановить контейнеры"
	@echo "  make clean       Полный сброс"
	@echo ""
