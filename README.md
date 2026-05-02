# MCP Server for Platinumlist

[![smithery badge](https://smithery.ai/badge/@platinumlist/mcp-server)](https://smithery.ai/server/@platinumlist/mcp-server)
[![npm version](https://img.shields.io/npm/v/@platinumlist/mcp-server)](https://www.npmjs.com/package/@platinumlist/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides tools for discovering events, artists and venues through the [Platinumlist](https://api.platinumlist.net) API.

## Features

- 🎫 **Search events** — by name, city, date range, status, event type
- 📅 **Filter by date** — human-friendly `YYYY-MM-DD` format
- 🏷️ **Filter by status** — `on sale`, `pre-sale`, `sold out` and more
- ⭐ **Sort by popularity** — get the most popular events first
- 📄 **Pagination** — navigate through large result sets
- 🎟️ **Event details** — full info including description, images, ticket URLs

### Manual Installation

Add to your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "platinumlist": {
      "command": "npx",
      "args": ["-y", "@platinumlist/mcp-server"],
      "env": {
        "API_TOKEN": "your-platinumlist-api-token"
      }
    }
  }
}
```

Restart Claude Desktop — the 🔌 MCP icon will appear in the interface.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `API_TOKEN` | ✅ | Your Platinumlist API Bearer token |
| `API_BASE_URL` | ❌ | API base URL (default: `https://api.platinumlist.net/v/7`) |

To get your API token, contact [Platinumlist](https://platinumlist.net).

## Available Tools

### `search_events`

Search for events with flexible filtering.

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search by event name |
| `has_tickets` | boolean | Only events with available tickets |
| `start_from` | string | Events starting from date `YYYY-MM-DD` |
| `start_to` | string | Events starting before date `YYYY-MM-DD` |
| `end_from` | string | Events ending after date `YYYY-MM-DD` |
| `end_to` | string | Events ending before date `YYYY-MM-DD` |
| `city_id` | number | Filter by city ID |
| `event_type_id` | number | Filter by event type ID |
| `event_type_recursive` | boolean | Include sub-types |
| `is_attraction` | boolean | Only attractions |
| `is_online` | boolean | Only online events |
| `status` | enum | `on sale` · `pre-sale` · `pre-register` · `approved` · `sold out` |
| `sort` | enum | `start` · `end` · `rating` · `-rating` (popular first) |
| `page` | number | Page number |

**Example prompts:**

> "Find concerts in Dubai this weekend"

> "Show me the most popular events on sale right now"

> "Search for Swan Lake events starting after June 1st"

---

### `get_event`

Get full details of a specific event by ID.

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Event ID from `search_events` results |

**Example prompts:**

> "Get full details for event ID 11634"

> "Tell me more about that event"

## Example Usage

Once connected, you can ask Claude naturally:

```
Find me events in Dubai next month that still have tickets available,
sorted by popularity. Show the top 5.
```

```
Search for Swan Lake performances and give me full details
about the first result.
```

```
Are there any pre-sale events happening between July 1 and July 31?
```

## License

MIT © [Platinumlist](https://github.com/Platinumlist/)