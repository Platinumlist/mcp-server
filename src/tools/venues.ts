import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z }         from "zod";

import { searchVenues, getVenueById } from "../api-client.js";
import {
  formatVenueShort,
  formatVenueFull,
  formatPagination,
  formatNextPageHint,
} from "../helpers/format.js";

export function registerVenueTools(server: McpServer): void {

  // ── Tool 1: search_venues ────────────────────────────────────────────────────
  server.registerTool(
    "search_venues",
    {
      title: "Search Venues",
      description:
        "Search for venues on Platinumlist by name or city. " +
        "Returns a paginated list. Use get_venue to get full details by ID.",
      inputSchema: {
        search: z
          .string()
          .optional()
          .describe("Search by venue name, e.g. 'Club XYZ', 'Arena'"),
        city_id: z
          .number()
          .optional()
          .describe("Filter by city ID"),
        page: z
          .number()
          .optional()
          .describe("Page number, default: 1"),
      },
    },
    async ({ search, city_id, page }) => {
      try {
        const result = await searchVenues({
          search,
          "city.id": city_id,
          page,
        });

        if (!result.data || result.data.length === 0) {
          return {
            content: [{
              type: "text" as const,
              text: "No venues found. Try a different search term.",
            }],
          };
        }

        const header = formatPagination(result.meta.pagination) + ":\n\n";
        const body   = result.data.map((v, i) => formatVenueShort(v, i)).join("\n\n");
        const footer = formatNextPageHint(result.meta.pagination);

        return {
          content: [{ type: "text" as const, text: header + body + footer }],
        };
      } catch (error) {
        return {
          content: [{
            type:    "text" as const,
            text:    `Error searching venues: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    }
  );

  // ── Tool 2: get_venue ────────────────────────────────────────────────────────
  server.registerTool(
    "get_venue",
    {
      title: "Get Venue Details",
      description:
        "Get full details of a specific venue by ID. " +
        "Returns address, coordinates, phone, website and images.",
      inputSchema: {
        id: z.number().describe("Venue ID obtained from search_venues results"),
      },
    },
    async ({ id }) => {
      try {
        const result = await getVenueById(id);
        return {
          content: [{ type: "text" as const, text: formatVenueFull(result.data) }],
        };
      } catch (error) {
        return {
          content: [{
            type:    "text" as const,
            text:    `Error fetching venue ${id}: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    }
  );
}
