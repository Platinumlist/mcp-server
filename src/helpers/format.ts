/**
 * Helpers for formatting API responses into readable text.
 *
 * MCP returns Claude text responses — these functions
 * transform raw API objects into clear, human-readable text.
 */

import {type ApiEvent, type ApiPagination} from "../types/events.js";
import {type ApiArtist} from "../types/artists.js";
import {type ApiVenue} from "../types/venues.js";
import {timestampToDate} from "./date.js";

/**
 * Short event formatting — for lists (search_events).
 * Shows main fields without description and images.
 */
export function formatEventShort(event: ApiEvent, index?: number): string {
    const prefix = index !== undefined ? `${index + 1}. ` : "";
    const lines: string[] = [];

    lines.push(`${prefix}[ID: ${event.id}] ${event.name}`);
    lines.push(`   Status: ${event.status}`);
    lines.push(`   Start: ${timestampToDate(event.start)}`);
    lines.push(`   End:  ${timestampToDate(event.end)}`);
    lines.push(`   Tickets: ${event.has_tickets ? "available" : "unavailable"}`);

    if (event.is_attraction) lines.push(`   Attraction: yes`);
    if (event.is_online) lines.push(`   Online: yes`);
    if (event.artwork_label) lines.push(`   Label: ${event.artwork_label}`);
    if (event.rating) lines.push(`   Rating: ${event.rating}`);
    if (event.text_teaser) lines.push(`   Teaser: ${event.text_teaser}`);
    if (event.url) lines.push(`   Link: ${event.url}`);

    return lines.join("\n");
}

/**
 * Full event formatting — for detailed view (get_event).
 * Shows all fields including description and images.
 */
export function formatEventFull(event: ApiEvent): string {
    const lines: string[] = [];

    lines.push(`[ID: ${event.id}] ${event.name}`);
    lines.push(`Status: ${event.status}`);
    lines.push(`Start: ${timestampToDate(event.start)}`);
    lines.push(`End:  ${timestampToDate(event.end)}`);
    lines.push(`Tickets: ${event.has_tickets ? "available" : "unavailable"}`);
    lines.push(`Sales started: ${event.has_sales_started ? "yes" : "no"}`);

    if (event.is_attraction !== undefined) lines.push(`Attraction: ${event.is_attraction ? "yes" : "no"}`);
    if (event.is_online !== undefined) lines.push(`Online: ${event.is_online ? "yes" : "no"}`);
    if (event.artwork_label) lines.push(`Label: ${event.artwork_label}`);
    if (event.rating) lines.push(`Rating: ${event.rating}`);
    if (event.vat) lines.push(`VAT: ${event.vat}%`);

    if (event.description) {
        lines.push(`\nDescription:\n${event.description}`);
    }

    if (event.url) lines.push(`\nLink: ${event.url}`);
    if (event.white_label_url) lines.push(`White label: ${event.white_label_url}`);

    const img = event.image_big;
    if (img && !Array.isArray(img)) {
        lines.push(`Image: ${img.src}`);
    }

    return lines.join("\n");
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export function formatPagination(p: ApiPagination): string {
    return (
        `Found ${p.total} total ` +
        `(page ${p.current_page} of ${p.total_pages}, ` +
        `showing ${p.count} of ${p.per_page} per page)`
    );
}

export function formatNextPageHint(p: ApiPagination): string {
    return p.links.next
        ? `\n\nNext page available — use page: ${p.current_page + 1}`
        : "";
}

// ─── Artists ──────────────────────────────────────────────────────────────────

export function formatArtistShort(artist: ApiArtist, index?: number): string {
    const prefix = index !== undefined ? `${index + 1}. ` : "";
    const lines: string[] = [];

    lines.push(`${prefix}[ID: ${artist.id}] ${artist.name}`);
    if (artist.url) lines.push(`   Link: ${artist.url}`);

    return lines.join("\n");
}

export function formatArtistFull(artist: ApiArtist): string {
    const lines: string[] = [];

    lines.push(`[ID: ${artist.id}] ${artist.name}`);
    if (artist.url) lines.push(`Link: ${artist.url}`);

    return lines.join("\n");
}

// ─── Venues ───────────────────────────────────────────────────────────────────

export function formatVenueShort(venue: ApiVenue, index?: number): string {
    const prefix = index !== undefined ? `${index + 1}. ` : "";
    const lines: string[] = [];

    lines.push(`${prefix}[ID: ${venue.id}] ${venue.name}`);
    if (venue.location) lines.push(`   Address: ${venue.location}`);
    if (venue.latitude && venue.longitude) {
        lines.push(`   Coordinates: ${venue.latitude}, ${venue.longitude}`);
    }

    return lines.join("\n");
}

export function formatVenueFull(venue: ApiVenue): string {
    const lines: string[] = [];

    lines.push(`[ID: ${venue.id}] ${venue.name}`);
    if (venue.info) lines.push(`Info: ${venue.info}`);
    if (venue.location) lines.push(`Address: ${venue.location}`);
    if (venue.phone) lines.push(`Phone: ${venue.phone}`);
    if (venue.website) lines.push(`Website: ${venue.website}`);

    if (venue.latitude && venue.longitude) {
        lines.push(`Coordinates: ${venue.latitude}, ${venue.longitude}`);
        lines.push(`Map: https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`);
    }

    const img = venue.image_big;
    if (img && !Array.isArray(img)) lines.push(`Image: ${img.src}`);

    return lines.join("\n");
}