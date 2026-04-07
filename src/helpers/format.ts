/**
 * Хелперы для форматирования ответов API в читаемый текст.
 *
 * MCP возвращает Claude текстовые ответы — эти функции
 * превращают сырые объекты API в понятный текст.
 */

import { type ApiEvent, type ApiPagination } from "../types/events.js";
import { timestampToDate } from "./date.js";

/**
 * Краткое форматирование события — для списков (search_events).
 * Показывает основные поля без описания и изображений.
 */
export function formatEventShort(event: ApiEvent, index?: number): string {
  const prefix = index !== undefined ? `${index + 1}. ` : "";
  const lines: string[] = [];

  lines.push(`${prefix}[ID: ${event.id}] ${event.name}`);
  lines.push(`   Статус: ${event.status}`);
  lines.push(`   Начало: ${timestampToDate(event.start)}`);
  lines.push(`   Конец:  ${timestampToDate(event.end)}`);
  lines.push(`   Билеты: ${event.has_tickets ? "доступны" : "недоступны"}`);

  if (event.is_attraction)  lines.push(`   Аттракция: да`);
  if (event.is_online)      lines.push(`   Онлайн: да`);
  if (event.artwork_label)  lines.push(`   Метка: ${event.artwork_label}`);
  if (event.rating)         lines.push(`   Рейтинг: ${event.rating}`);
  if (event.text_teaser)    lines.push(`   Анонс: ${event.text_teaser}`);
  if (event.url)            lines.push(`   Ссылка: ${event.url}`);

  return lines.join("\n");
}

/**
 * Полное форматирование события — для детального просмотра (get_event).
 * Показывает все поля включая описание и изображения.
 */
export function formatEventFull(event: ApiEvent): string {
  const lines: string[] = [];

  lines.push(`[ID: ${event.id}] ${event.name}`);
  lines.push(`Статус: ${event.status}`);
  lines.push(`Начало: ${timestampToDate(event.start)}`);
  lines.push(`Конец:  ${timestampToDate(event.end)}`);
  lines.push(`Билеты: ${event.has_tickets ? "доступны" : "недоступны"}`);
  lines.push(`Продажи открыты: ${event.has_sales_started ? "да" : "нет"}`);

  if (event.is_attraction !== undefined) lines.push(`Аттракция: ${event.is_attraction ? "да" : "нет"}`);
  if (event.is_online !== undefined)     lines.push(`Онлайн: ${event.is_online ? "да" : "нет"}`);
  if (event.artwork_label)               lines.push(`Метка: ${event.artwork_label}`);
  if (event.rating)                      lines.push(`Рейтинг: ${event.rating}`);
  if (event.vat)                         lines.push(`НДС: ${event.vat}%`);

  if (event.description) {
    lines.push(`\nОписание:\n${event.description}`);
  }

  if (event.url)             lines.push(`\nСсылка: ${event.url}`);
  if (event.white_label_url) lines.push(`White label: ${event.white_label_url}`);

  const img = event.image_big;
  if (img && !Array.isArray(img)) {
    lines.push(`Изображение: ${img.src}`);
  }

  return lines.join("\n");
}

/**
 * Форматирование блока пагинации.
 * Используется в любом инструменте который возвращает списки с пагинацией.
 *
 * @example
 * formatPagination(pagination) →
 * "Found 490 total (page 1 of 49, showing 10 per page)"
 */
export function formatPagination(p: ApiPagination): string {
  return (
    `Found ${p.total} total ` +
    `(page ${p.current_page} of ${p.total_pages}, ` +
    `showing ${p.count} of ${p.per_page} per page)`
  );
}

/**
 * Подсказка о следующей странице.
 * Добавляется в конец списка если есть ещё результаты.
 */
export function formatNextPageHint(p: ApiPagination): string {
  return p.links.next
    ? `\n\nNext page available — use page: ${p.current_page + 1}`
    : "";
}
