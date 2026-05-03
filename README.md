# MCP Server for Platinumlist

[![npm version](https://img.shields.io/npm/v/@platinumlist/mcp-server)](https://www.npmjs.com/package/@platinumlist/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides tools for discovering events, artists and venues through
the [Platinumlist](https://platinumlist.net) API.

## Features

- 🎫 **Search events** — by name, city, date range, status, event type
- 🎤 **Search artists** — by name with pagination
- 🏟️ **Search venues** — by name or city
- 📅 **Filter by date** — human-friendly `YYYY-MM-DD` format
- 🏷️ **Filter by status** — `on sale`, `pre-sale`, `sold out` and more
- ⭐ **Sort by popularity** — get the most popular events first
- 📄 **Pagination** — navigate through large result sets

---

## Step 1 — Install Node.js

`npx` is included with Node.js. You need to install it once on your machine.

### Windows

1. Go to [nodejs.org](https://nodejs.org)
2. Click the **LTS** button to download the installer
3. Run the installer with default settings
4. Open **Command Prompt** or **PowerShell** and verify:

```
node -v
npm -v
```

Alternatively, using **winget**:

```powershell
winget install OpenJS.NodeJS.LTS
```

### macOS

Using **Homebrew** (recommended):

```bash
brew install node
```

Or download the installer from [nodejs.org](https://nodejs.org) → **LTS**.

Verify:

```bash
node -v
npm -v
```

### Ubuntu / Linux

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## Step 2 — Configure Claude Desktop

Open your Claude Desktop config file:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Add the following:

```json
{
  "mcpServers": {
    "platinumlist": {
      "command": "npx",
      "args": [
        "-y",
        "@platinumlist/mcp-server"
      ],
      "env": {
        "API_KEY": "your-platinumlist-api-key"
      }
    }
  }
}
```

Restart Claude Desktop — the 🔌 MCP icon will appear in the interface.

---

## Configuration

| Variable       | Required | Description                                                |
|----------------|----------|------------------------------------------------------------|
| `API_KEY`      | ✅        | Your Platinumlist API key                                  |
| `API_BASE_URL` | ❌        | API base URL (default: `https://api.platinumlist.net/v/7`) |

To get your API key, contact [Platinumlist](https://platinumlist.net).

---

## Available Tools

### `search_events`

Search for events with flexible filtering.

| Parameter              | Type    | Description                                                       |
|------------------------|---------|-------------------------------------------------------------------|
| `search`               | string  | Search by event name                                              |
| `has_tickets`          | boolean | Only events with available tickets                                |
| `start_from`           | string  | Events starting from date `YYYY-MM-DD`                            |
| `start_to`             | string  | Events starting before date `YYYY-MM-DD`                          |
| `end_from`             | string  | Events ending after date `YYYY-MM-DD`                             |
| `end_to`               | string  | Events ending before date `YYYY-MM-DD`                            |
| `city_id`              | number  | Filter by city ID                                                 |
| `event_type_id`        | number  | Filter by event type ID                                           |
| `event_type_recursive` | boolean | Include sub-types                                                 |
| `is_attraction`        | boolean | Only attractions                                                  |
| `is_online`            | boolean | Only online events                                                |
| `status`               | enum    | `on sale` · `pre-sale` · `pre-register` · `approved` · `sold out` |
| `sort`                 | enum    | `start` · `end` · `rating` · `-rating` (popular first)            |
| `page`                 | number  | Page number                                                       |

### `get_event`

Get full details of a specific event by ID.

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| `id`      | number | Event ID from `search_events` results |

---

### `search_artists`

Search for artists by name.

| Parameter | Type   | Description           |
|-----------|--------|-----------------------|
| `search`  | string | Search by artist name |
| `page`    | number | Page number           |

### `get_artist`

Get details of a specific artist by ID.

| Parameter | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| `id`      | number | Artist ID from `search_artists` results |

---

### `search_venues`

Search for venues by name or city.

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| `search`  | string | Search by venue name |
| `city_id` | number | Filter by city ID    |
| `page`    | number | Page number          |

### `get_venue`

Get full details of a specific venue by ID. Returns address, coordinates, phone, website and Google Maps link.

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| `id`      | number | Venue ID from `search_venues` results |

---

## Example Usage

Once connected, you can ask Claude naturally:

```
Find me events in Dubai next month that still have tickets available,
sorted by popularity. Show the top 5.
```

```
Search for venues in Abu Dhabi and show me the address and map link
for the first result.
```

```
Find the artist Coldplay and get their full details.
```

```
Are there any pre-sale events happening between July 1 and July 31?
```

---

## License

MIT © [Platinumlist](https://platinumlist.net)