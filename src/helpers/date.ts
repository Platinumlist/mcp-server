/**
 * Converts a Unix timestamp (seconds) into a human-readable date.
 * Used when formatting responses for Claude.
 *
 * @example timestampToDate(1748736000) → "01 Jun 2025, 00:00"
 */
export function timestampToDate(ts: number): string {
    return new Date(ts * 1000).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
}
