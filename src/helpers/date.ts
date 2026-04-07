/**
 * Конвертирует unix timestamp (секунды) в читаемую дату.
 * Используется при форматировании ответов для Claude.
 *
 * @example timestampToDate(1748736000) → "01 Jun 2025, 00:00"
 */
export function timestampToDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString("en-GB", {
    day:      "2-digit",
    month:    "short",
    year:     "numeric",
    hour:     "2-digit",
    minute:   "2-digit",
    timeZone: "UTC",
  });
}
