/**
 * HTTP клиент для Platinumlist API v7
 *
 * Отвечает только за HTTP запросы и авторизацию.
 * Типы — в src/types/
 * Форматирование — в src/helpers/
 */

import {
  type EventsListResponse,
  type EventSingleResponse,
  type SearchEventsParams,
} from "./types/events.js";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://api.platinumlist.net/v/7";
const API_TOKEN    = process.env.API_TOKEN ?? "";

if (!API_TOKEN) {
  throw new Error("API_TOKEN environment variable is required");
}

// Фиксированный scope для MCP — менять не нужно
const MCP_SCOPE = "affiliate.show.events";

// ─── Базовая функция запроса ──────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const cleanParams = Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  );

  const url = new URL(`${API_BASE_URL}${path}`);
  url.search = new URLSearchParams(cleanParams).toString();

  const response = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
      "Accept":        "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status} for ${path}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// ─── Методы ──────────────────────────────────────────────────────────────────

export async function searchEvents(
  params: SearchEventsParams
): Promise<EventsListResponse> {
  return apiFetch<EventsListResponse>("/events", {
    scope: MCP_SCOPE,
    ...params,
  });
}

export async function getEventById(id: number): Promise<EventSingleResponse> {
  return apiFetch<EventSingleResponse>(`/events/${id}`, {
    scope: MCP_SCOPE,
  });
}
