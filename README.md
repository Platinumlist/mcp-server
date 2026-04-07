# MCP Server — Events API

MCP сервер для поиска ивентов через ваш API. Работает с Claude Desktop и Claude Code.

## Требования

- Docker и Docker Compose
- Больше ничего! Node.js и npm не нужны.

## Быстрый старт для разработчиков

```bash
# 1. Клонируйте репо
git clone https://bitbucket.org/your-team/mcp-server-events.git
cd mcp-server-events

# 2. Создайте .env с вашими данными
cp .env.example .env
# Заполните API_BASE_URL и API_TOKEN в .env

# 3. Установите зависимости (один раз)
make install

# 4. Запустите dev сервер с hot reload
make dev
```

Сервер запущен. При изменении файлов в `src/` — перезапускается автоматически.

## Команды

| Команда | Описание |
|---|---|
| `make install` | Установить зависимости (первый запуск / после изменения package.json) |
| `make dev` | Запустить dev сервер с hot reload |
| `make inspector` | Открыть тест инструментов → http://localhost:5173 |
| `make build` | Собрать production образ |
| `make logs` | Логи dev контейнера |
| `make stop` | Остановить контейнеры |
| `make clean` | Полный сброс (удалить образы и volume) |

## Тестирование инструментов

```bash
make inspector
# Откройте http://localhost:5173
# Вызовите search_events или get_event вручную
```

## Подключение к Claude Desktop

```json
{
  "mcpServers": {
    "events": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "--env-file", "/absolute/path/to/.env",
        "mcp-server-events:latest"
      ]
    }
  }
}
```

## Инструменты

### `search_events`
Поиск ивентов. Параметры: `query`, `city`, `country`, `date_from`, `date_to`, `page`, `limit`.

### `get_event`
Получить детали ивента по ID. Параметр: `id`.

## Структура проекта

```
src/
├── index.ts          # Точка входа, запуск MCP сервера
├── api-client.ts     # HTTP клиент для PHP API (авторизация, fetch)
└── tools/
    └── events.ts     # Инструменты search_events и get_event
```

## Добавить новые инструменты (artists, venues)

1. Создайте `src/tools/artists.ts` по аналогии с `events.ts`
2. Подключите в `src/index.ts`:
   ```typescript
   import { registerArtistTools } from "./tools/artists.js";
   registerArtistTools(server);
   ```

## License

MIT
