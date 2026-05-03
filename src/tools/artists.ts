import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";

import {searchArtists, getArtistById} from "../api-client.js";
import {
    formatArtistShort,
    formatArtistFull,
    formatPagination,
    formatNextPageHint,
} from "../helpers/format.js";

export function registerArtistTools(server: McpServer): void {

    // ── Tool 1: search_artists ───────────────────────────────────────────────────
    server.registerTool(
        "search_artists",
        {
            title: "Search Artists",
            description:
                "Search for artists on Platinumlist by name. " +
                "Returns a paginated list. Use get_artist to get details by ID.",
            inputSchema: {
                search: z
                    .string()
                    .optional()
                    .describe("Search by artist name, e.g. 'Coldplay', 'DJ Snake'"),
                page: z
                    .number()
                    .optional()
                    .describe("Page number, default: 1"),
            },
        },
        async ({search, page}) => {
            try {
                const result = await searchArtists({search, page});

                if (!result.data || result.data.length === 0) {
                    return {
                        content: [{
                            type: "text" as const,
                            text: "No artists found. Try a different search term.",
                        }],
                    };
                }

                const header = formatPagination(result.meta.pagination) + ":\n\n";
                const body = result.data.map((a, i) => formatArtistShort(a, i)).join("\n\n");
                const footer = formatNextPageHint(result.meta.pagination);

                return {
                    content: [{type: "text" as const, text: header + body + footer}],
                };
            } catch (error) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `Error searching artists: ${error instanceof Error ? error.message : String(error)}`,
                    }],
                    isError: true,
                };
            }
        }
    );

    // ── Tool 2: get_artist ───────────────────────────────────────────────────────
    server.registerTool(
        "get_artist",
        {
            title: "Get Artist Details",
            description: "Get details of a specific artist by ID.",
            inputSchema: {
                id: z.number().describe("Artist ID obtained from search_artists results"),
            },
        },
        async ({id}) => {
            try {
                const result = await getArtistById(id);
                return {
                    content: [{type: "text" as const, text: formatArtistFull(result.data)}],
                };
            } catch (error) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `Error fetching artist ${id}: ${error instanceof Error ? error.message : String(error)}`,
                    }],
                    isError: true,
                };
            }
        }
    );
}
