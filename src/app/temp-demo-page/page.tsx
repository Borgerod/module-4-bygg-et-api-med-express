"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Notification } from "@/components/ui/Notification";
import { cn } from "@lib/utils";
import { useTheme } from "next-themes";

export default function DemoPage() {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        "max-w-5xl",
        "w-fit",

        "",
        "",
      )}
    >
      <h1
        id="page-header page-title"
        suppressHydrationWarning
        className={cn(
          "text-3xl",
          "max-w-lg min-w-xs",
          "font-semibold tracking-tight text-nowrap",
          "",
          "",
        )}
      >
        Component Demo:{" "}
        <span className="text-gray-400 font-normal">
          &lt;<span className="text-teal-500">Notification</span>
          &gt;
        </span>
      </h1>

      <div
        id="demo-container-row"
        className={cn(
          "flex flex-col  gap-5",
          "justify-between",
          "md:flex-row",
          "",
        )}
      >
        <Card
          id="light-mode-card notification-demo column-1"
          className={cn("bg-background gap-0", "max-w-lg", "lg:w-lg", "", "")}
        >
          <CardHeader>
            <CardTitle>{theme} mode</CardTitle>
            <CardDescription>
              Click the darkmode button to all variants. <br />
              Also, don&apos;t forget to expand the components.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <Notification
              message="There is a known vulnerability in a dependency. Please be cautious."
              moreUrl="https://github.com/advisories/GHSA-8r9q-7v3j-jr4g"
              moreTitle="Anthropic's MCP TypeScript SDK has a ReDoS vulnerability"
              moreText={`@modelcontextprotocol/sdk  <1.25.2
                    Severity: high
                    Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
                    No fix available
                    node_modules/@modelcontextprotocol/sdk
                    next-devtools-mcp  *
                    Depends on vulnerable versions of @modelcontextprotocol/sdk
                    Depends on vulnerable versions of undici
                    node_modules/next-devtools-mcp`}
              type="default"
            />
            <Notification
              message="There is a known vulnerability in a dependency. Please be cautious."
              moreUrl="https://github.com/advisories/GHSA-8r9q-7v3j-jr4g"
              moreTitle="Anthropic's MCP TypeScript SDK has a ReDoS vulnerability"
              moreText={`@modelcontextprotocol/sdk  <1.25.2
                    Severity: high
                    Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
                    No fix available
                    node_modules/@modelcontextprotocol/sdk
                    next-devtools-mcp  *
                    Depends on vulnerable versions of @modelcontextprotocol/sdk
                    Depends on vulnerable versions of undici
                    node_modules/next-devtools-mcp`}
              type="info"
            />
            <Notification
              message="There is a known vulnerability in a dependency. Please be cautious."
              moreUrl="https://github.com/advisories/GHSA-8r9q-7v3j-jr4g"
              moreTitle="Anthropic's MCP TypeScript SDK has a ReDoS vulnerability"
              moreText={`@modelcontextprotocol/sdk  <1.25.2
                    Severity: high
                    Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
                    No fix available
                    node_modules/@modelcontextprotocol/sdk
                    next-devtools-mcp  *
                    Depends on vulnerable versions of @modelcontextprotocol/sdk
                    Depends on vulnerable versions of undici
                    node_modules/next-devtools-mcp`}
              type="success"
            />
            <Notification
              message="There is a known vulnerability in a dependency. Please be cautious."
              moreUrl="https://github.com/advisories/GHSA-8r9q-7v3j-jr4g"
              moreTitle="Anthropic's MCP TypeScript SDK has a ReDoS vulnerability"
              moreText={`@modelcontextprotocol/sdk  <1.25.2
                    Severity: high
                    Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
                    No fix available
                    node_modules/@modelcontextprotocol/sdk
                    next-devtools-mcp  *
                    Depends on vulnerable versions of @modelcontextprotocol/sdk
                    Depends on vulnerable versions of undici
                    node_modules/next-devtools-mcp`}
              type="issue"
            />
            <Notification
              message="There is a known vulnerability in a dependency. Please be cautious."
              moreUrl="https://github.com/advisories/GHSA-8r9q-7v3j-jr4g"
              moreTitle="Anthropic's MCP TypeScript SDK has a ReDoS vulnerability"
              moreText={`@modelcontextprotocol/sdk  <1.25.2
                    Severity: high
                    Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
                    No fix available
                    node_modules/@modelcontextprotocol/sdk
                    next-devtools-mcp  *
                    Depends on vulnerable versions of @modelcontextprotocol/sdk
                    Depends on vulnerable versions of undici
                    node_modules/next-devtools-mcp`}
              type="error"
            />
            <Notification
              message="There is a known vulnerability in a dependency. Please be cautious."
              moreUrl="https://github.com/advisories/GHSA-8r9q-7v3j-jr4g"
              moreTitle="Anthropic's MCP TypeScript SDK has a ReDoS vulnerability"
              moreText={`@modelcontextprotocol/sdk  <1.25.2
                    Severity: high
                    Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
                    No fix available
                    node_modules/@modelcontextprotocol/sdk
                    next-devtools-mcp  *
                    Depends on vulnerable versions of @modelcontextprotocol/sdk
                    Depends on vulnerable versions of undici
                    node_modules/next-devtools-mcp`}
              type="warning"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
