#!/usr/bin/env node
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {registerEventTools} from "./tools/events.js";
import {registerArtistTools} from "./tools/artists.js";
import {registerVenueTools} from "./tools/venues.js";

async function main(): Promise<void> {
    const server = new McpServer({
        name: "platinumlist-mcp-server",
        version: "0.2.0",
    });

    // Registering tools
    registerEventTools(server);
    registerArtistTools(server);
    registerVenueTools(server);

    // Stdio transport — communication via stdin/stdout, logs only go to stderr
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("[MCP] Platinumlist server started — events, artists, venues ready");
}

main().catch((error: unknown) => {
    console.error("[MCP] Fatal error:", error);
    process.exit(1);
});
