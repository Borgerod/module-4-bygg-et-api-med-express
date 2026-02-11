"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { cn } from "@lib/utils";
import { useTheme } from "next-themes";

export default function DarkModeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      aria-pressed={theme === "dark" ? "true" : "false"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "fixed",
        "bottom-4",
        "right-4",
        "z-50",
        "w-10",
        "h-10",
        "items-center",
        "justify-center",
        "rounded-md",
        "border-border",
        "bg-background",
        "text-foreground",
        "shadow-sm",
        "transition-colors",
        "hover:opacity-90",
        "focus-visible:ring-2",
        "focus-visible:ring-accent",
        "",
        "",
      )}
    >
      {theme === "dark" ? (
        <FiMoon className={cn("w-5", "h-5", "", "")} aria-hidden />
      ) : (
        <FiSun className={cn("w-5", "h-5", "", "")} aria-hidden />
      )}
    </Button>
  );
}
