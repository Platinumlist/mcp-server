import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z }         from "zod";

import { searchEvents, getEventById } from "../api-client.js";
import { dateToTimestamp }            from "../helpers/date.js";
import {
  formatEventShort,
  formatEventFull,
  formatPagination,
  formatNextPageHint,
} from "../helpers/format.js";

export function registerEventTools(server: McpServer): void {

  // ── Tool 1: search_events ────────────────────────────────────────────────────
  server.registerTool(
    "search_events",
    {
      title: "Search Events",
      description:
        "Search for events on Platinumlist. " +
        "Supports filtering by name, date range, city, event type, status and more. " +
        "Dates should be provided in YYYY-MM-DD format. " +
        "Returns paginated list. Use get_event to get full details by ID.",
      inputSchema: {
        search: z
          .string()
          .optional()
          .describe("Search by event name, e.g. 'Swan Lake', 'DJ Night'"),

        has_tickets: z
          .boolean()
          .optional()
          .describe("If true — return only events with available tickets"),

        start_from: z
          .string()
          .optional()
          .describe("Show events starting from this date. Format: YYYY-MM-DD"),

        start_to: z
          .string()
          .optional()
          .describe("Show events starting before this date. Format: YYYY-MM-DD"),

        end_from: z
          .string()
          .optional()
          .describe("Show events ending after this date. Format: YYYY-MM-DD"),

        end_to: z
          .string()
          .optional()
          .describe("Show events ending before this date. Format: YYYY-MM-DD"),

        city_id: z
          .number()
          .optional()
          .describe("Filter by city ID"),

        event_type_id: z
          .number()
          .optional()
          .describe("Filter by event type ID"),

        event_type_recursive: z
          .boolean()
          .optional()
          .describe("If true — include sub-types of the specified event type"),

        is_attraction: z
          .boolean()
          .optional()
          .describe("If true — return only attractions"),

        is_online: z
          .boolean()
          .optional()
          .describe("If true — return only online events"),

        status: z
          .enum(["approved", "on sale", "pre-register", "pre-sale", "sold out"])
          .optional()
          .describe("Filter by event status"),

        sort: z
          .enum(["start", "end", "rating", "-rating"])
          .optional()
          .describe("Sort order. Use '-rating' for most popular events first"),

        page: z
          .number()
          .optional()
          .describe("Page number, default: 1"),
      },
    },
    async ({
      search,
      has_tickets,
      start_from,
      start_to,
      end_from,
      end_to,
      city_id,
      event_type_id,
      event_type_recursive,
      is_attraction,
      is_online,
      status,
      sort,
      page,
    }) => {
      try {
        const result = await searchEvents({
          search,
          has_tickets,
          start_from: start_from ? dateToTimestamp(start_from) : undefined,
          start_to:   start_to   ? dateToTimestamp(start_to)   : undefined,
          end_from:   end_from   ? dateToTimestamp(end_from)   : undefined,
          end_to:     end_to     ? dateToTimestamp(end_to)     : undefined,
          "city.id":       city_id,
          "event_type.id": event_type_id,
          event_type_recursive,
          is_attraction: is_attraction ? 1 : undefined,
          is_online:     is_online     ? 1 : undefined,
          status,
          sort,
          page,
        });

        if (!result.data || result.data.length === 0) {
          return {
            content: [{
              type: "text" as const,
              text: "No events found for the given criteria. Try broader search parameters.",
            }],
          };
        }

        const header = formatPagination(result.meta.pagination) + ":\n\n";
        const body   = result.data.map((e, i) => formatEventShort(e, i)).join("\n\n");
        const footer = formatNextPageHint(result.meta.pagination);

        return {
          content: [{
            type: "text" as const,
            text: header + body + footer,
          }],
        };
      } catch (error) {
        return {
          content: [{
            type:    "text" as const,
            text:    `Error searching events: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    }
  );

  // ── Tool 2: get_event ────────────────────────────────────────────────────────
  server.registerTool(
    "get_event",
    {
      title: "Get Event Details",
      description:
        "Get full details of a specific event by its ID. " +
        "Returns complete information: description, dates, status, images, URLs.",
      inputSchema: {
        id: z
          .number()
          .describe("Event ID (integer) obtained from search_events results"),
      },
    },
    async ({ id }) => {
      try {
        const result = await getEventById(id);
        return {
          content: [{
            type: "text" as const,
            text: formatEventFull(result.data),
          }],
        };
      } catch (error) {
        return {
          content: [{
            type:    "text" as const,
            text:    `Error fetching event ${id}: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    }
  );
}
