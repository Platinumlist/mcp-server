import {type EventsListResponse, type EventSingleResponse, type SearchEventsParams,} from "./types/events.js";
import {type ArtistsListResponse, type ArtistSingleResponse, type SearchArtistsParams} from "./types/artists.js";
import {type VenuesListResponse, type VenueSingleResponse, type SearchVenuesParams} from "./types/venues.js";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://api.platinumlist.net/v/7";
const API_KEY = process.env.API_KEY ?? "";
const CF_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID ?? "";
const CF_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET ?? "";

if (!API_KEY) {
    throw new Error("API_KEY environment variable is required");
}

// Fixed scope for MCP — do not change
const MCP_SCOPE = "affiliate.show.events";

async function apiFetch<T>(
    path: string,
    params: object = {}
): Promise<T> {
    const cleanParams = Object.fromEntries(
        Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
    );

    const url = new URL(`${API_BASE_URL}${path}`);
    url.search = new URLSearchParams(cleanParams).toString();

    const headers: Record<string, string> = {
        "Api-Key": API_KEY,
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

// ─── Events ──────────────────────────────────────────────────────────────────

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

// ─── Artists ─────────────────────────────────────────────────────────────────

export async function searchArtists(params: SearchArtistsParams): Promise<ArtistsListResponse> {
    return apiFetch<ArtistsListResponse>("/artists", params);
}

export async function getArtistById(id: number): Promise<ArtistSingleResponse> {
    return apiFetch<ArtistSingleResponse>(`/artists/${id}`);
}

// ─── Venues ──────────────────────────────────────────────────────────────────

export async function searchVenues(params: SearchVenuesParams): Promise<VenuesListResponse> {
    return apiFetch<VenuesListResponse>("/venues", params);
}

export async function getVenueById(id: number): Promise<VenueSingleResponse> {
    return apiFetch<VenueSingleResponse>(`/venues/${id}`);
}