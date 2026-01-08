"use client";

import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function DarkModeButton() {
	const [isDark, setIsDark] = useState(() => {
		if (typeof document === "undefined") return false;
		return document.documentElement.classList.contains("dark");
	});

	const toggle = () => {
		const html = document.documentElement;
		const next = !isDark;
		if (next) {
			html.classList.add("dark");
			try {
				window.localStorage.setItem("theme", "dark");
			} catch {}
		} else {
			html.classList.remove("dark");
			try {
				window.localStorage.setItem("theme", "light");
			} catch {}
		}
		setIsDark(next);
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			aria-pressed={isDark ? "true" : "false"}
			onClick={toggle}
			className="fixed bottom-4 right-4 z-50 w-10 h-10 items-center justify-center rounded-md border-border bg-background text-foreground shadow-sm transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent"
		>
			{isDark ? (
				<FiMoon className="w-5 h-5" aria-hidden />
			) : (
				<FiSun className="w-5 h-5" aria-hidden />
			)}
		</Button>
	);
}
