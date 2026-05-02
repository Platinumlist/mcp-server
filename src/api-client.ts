import {
    type EventsListResponse,
    type EventSingleResponse,
    type SearchEventsParams,
} from "./types/events.js";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://api.platinumlist.net/v/7";
const API_TOKEN = process.env.API_TOKEN ?? "";
const CF_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID ?? "";
const CF_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET ?? "";

if (!API_TOKEN) {
    throw new Error("API_TOKEN environment variable is required");
}

// Fixed scope for MCP — do not change
const MCP_SCOPE = "affiliate.show.events";

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

    const headers: Record<string, string> = {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    // CF Access headers — required for the dev environment behind Cloudflare Access
    if (CF_CLIENT_ID && CF_CLIENT_SECRET) {
        headers["CF-Access-Client-Id"] = CF_CLIENT_ID;
        headers["CF-Access-Client-Secret"] = CF_CLIENT_SECRET;
    }

    const response = await fetch(url.toString(), {headers});

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status} for ${path}: ${errorText}`);
    }

    return response.json() as Promise<T>;
}

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
