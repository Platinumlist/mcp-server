#!/usr/bin/env node
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {registerEventTools} from "./tools/events.js";

async function main(): Promise<void> {
    const server = new McpServer({
        name: "platinumlist-mcp-server",
        version: "0.1.0",
    });

    // Registering tools
    registerEventTools(server);

    // Stdio transport — communication via stdin/stdout, logs only go to stderr
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("[MCP] Events server started successfully");
}

main().catch((error: unknown) => {
    console.error("[MCP] Fatal error:", error);
    process.exit(1);
});
