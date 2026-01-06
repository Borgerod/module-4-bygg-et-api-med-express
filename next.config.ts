import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		mcpServer: true,
		//   mcpServers: {
		// 	"next-devtools": {
		// 		command: "npx",
		// 		args: ["-y", "next-devtools-mcp@latest"],
		// 	},
		// },
	},
};

export default nextConfig;
