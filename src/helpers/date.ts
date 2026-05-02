/**
 * Converts a Unix timestamp (seconds) into a human-readable date.
 * Used when formatting responses for Claude.
 *
 * @example timestampToDate(1748736000) → "01 Jun 2025, 00:00"
 */

/**
 * Converts a date string YYYY-MM-DD to a Unix timestamp (seconds).
 * Claude passes dates in human format — the API expects numbers.
 *
 * @example dateToTimestamp("2025-06-01") → 1748736000
 */
export function dateToTimestamp(date: string): number {
    return Math.floor(new Date(date).getTime() / 1000);
}

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
