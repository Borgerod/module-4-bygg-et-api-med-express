"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card } from "./card";
import { cn } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";

interface WarningProps {
	message: string;
	storageKey?: string;
	moreUrl?: string;
	moreTitle?: string;
	moreText?: string;
}

export const Warning: React.FC<WarningProps> = ({
	message,
	storageKey = "app:warning:v1",
	moreUrl,
	moreTitle,
	moreText,
}) => {
	const [visible, setVisible] = useState<boolean | null>(null);

	useEffect(() => {
		try {
			setVisible(localStorage.getItem(storageKey) !== "dismissed");
		} catch {
			setVisible(true);
		}
	}, [storageKey]);

	if (visible === null) return null; // Wait until client-side check

	if (!visible) return null;

	const dismiss = () => {
		try {
			localStorage.setItem(storageKey, "dismissed");
		} catch {}
		setVisible(false);
	};

	return (
		<Card
			className={cn(
				"relative px-4 py-3",
				"rounded-xl",
				"border border-border",
				"bg-warning-light",
				"text-warning-strong",
				"grid",
				"grid-cols-[1fr_auto]",
				"grid-rows-[auto_auto]",
				"items-start",

				"gap-y-0",

				"",
				""
			)}
		>
			<div
				className={cn(
					"w-full flex items-center",
					// "gap-3",
					"row-start-1 col-start-1",
					"row-span-2 col-span-1",
					"grid",
					"grid-cols-subgrid",
					"grid-rows-subgrid",
					"",
					""
				)}
			>
				<span
					className={cn(
						"",
						"",
						"row-start-1 col-start-1",
						"row-span-1 col-span-1",
						"flex-1 text-sm",
						"",
						""
					)}
				>
					{message}
				</span>

				{/* moved read-more into its own row so it doesn't force the first row taller */}
				<Collapsible
					className={cn(
						"row-start-2 col-start-1",
						"row-span-1 col-span-1",

						"",
						""
					)}
				>
					<CollapsibleTrigger asChild>
						<Button
							variant="link"
							size="sm"
							className="text-warning"
						>
							Read more
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-2 w-full text-sm text-warning-strong">
						<p>
							{moreText ??
								"This dependency has a reported security vulnerability. Check the advisory for details and upgrade to a patched version when available."}
							{moreUrl && (
								<>
									{" "}
									<Link
										href={moreUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-warning underline "
									>
										{moreTitle ?? "View on GitHub"}
									</Link>
								</>
							)}
						</p>
					</CollapsibleContent>
				</Collapsible>
			</div>
			<Button
				variant="ghost"
				size="icon"
				onClick={dismiss}
				aria-label="Dismiss warning"
				className={cn(
					"row-start-1 col-start-2",
					"row-span-1 col-span-1",
					"justify-self-end self-start",
					"hover:bg-warning/30",
					"hover:text-warning-dark",
					"",
					""
				)}
			>
				<FiX className="w-4 h-4" aria-hidden />
			</Button>
		</Card>
	);
};
