"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { cn } from "@lib/utils";
import {
  FiX,
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiFlag,
  FiXCircle,
} from "react-icons/fi";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { ReactNode, useState, useEffect } from "react";

type WarningType =
  | "info"
  | "default"
  | "success"
  | "error"
  | "warning"
  | "issue";

type WarningProps = {
  message: string;
  storageKey?: string;
  moreUrl?: string;
  moreTitle?: string;
  moreText?: string;
  type?: WarningType;
};

const ICONS: Record<WarningType, ReactNode> = {
  info: <FiInfo size={20} />,
  default: <FiFlag size={20} />,
  success: <FiCheckCircle size={20} />,
  error: <FiXCircle size={20} />,
  warning: <FiAlertTriangle size={20} />,
  issue: <FiAlertCircle size={20} />,
};

const COLOR_MAP: Record<WarningType, string> = {
  info: "info",
  default: "default",
  success: "success",
  error: "warning",
  warning: "warning",
  issue: "issue",
};

export function Notification(props: WarningProps) {
  const {
    message,
    storageKey = "app:warning:v1",
    moreUrl,
    moreTitle,
    moreText,
    type = "default",
  } = props;

  const color = COLOR_MAP[type];

  const [visible, setVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // should not really have this in client files, but whatever. is so small and i cant be bothered to fix it rn.
    try {
      const isDismissed = localStorage.getItem(storageKey) === "dismissed";
      queueMicrotask(() => setVisible(!isDismissed));
    } catch {
      queueMicrotask(() => setVisible(true));
    }
  }, [storageKey]);

  if (visible === undefined || !visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, "dismissed");
    } catch {}
    setVisible(false);
  };

  return (
    <Card
      className={cn(
        "mx-auto p-5 gap-2 w-full max-w-3xl border",
        `bg-${color} dark:bg-${color}-dark`,
        `border-${color} dark:border-${color}-dark`,
        `text-${color} dark:text-${color}-dark`,
        "",
        "",
      )}
    >
      <div
        className={cn("flex items-center justify-between gap-2", "", "", "")}
      >
        <span
          className={cn(
            "mr-2 shrink-0",
            `text-${color} dark:text-${color}-dark`,
            "",
            "",
          )}
        >
          {ICONS[type]}
        </span>
        <h4
          className={cn(
            "text-sm font-semibold",
            `text-${color} dark:text-${color}-dark`,
            "mt-1",
            "mr-auto",
            "",
            "",
          )}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </h4>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Dismiss warning"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dismiss();
          }}
          className={cn(
            "shrink-0",
            `color-${color}`,
            `hover:bg-darker hover:text-darker`,
          )}
        >
          <FiX className="w-4 h-4" aria-hidden />
        </Button>
      </div>

      <CardContent className="px-0 ">
        <Collapsible className="rounded-md">
          <div className="flex-1 text-sm">
            <p className={cn(`text-${color} dark:text-${color}-dark`)}>
              {message}
            </p>
            <CollapsibleTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className={cn(
                  `text-${color} dark:text-${color}-dark`,
                  "bg-transparent border-none p-0 h-auto",
                  "cursor-pointer",
                )}
              >
                Read more
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent
            className={cn(
              "flex flex-col items-start gap-2 text-sm w-full mt-2",
              `text-${color} dark:text-${color}-dark`,
            )}
          >
            <pre
              className={cn(
                "font-mono whitespace-pre-wrap word-break-words text-xs rounded p-2 w-full",
                `bg-${color} bg-opacity-10 dark:bg-${color}-dark dark:bg-opacity-20`,
                `text-${color} dark:text-${color}-dark`,
              )}
            >
              {moreText ??
                "This dependency has a reported security vulnerability. Check the advisory for details and upgrade to a patched version when available."}
            </pre>
            {moreUrl && (
              <Link
                href={moreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "underline flex flex-row items-center",
                  "hover:opacity-80",
                  `text-${color} dark:text-${color}-dark`,
                  "gap-2",
                )}
              >
                {moreTitle ?? "View on GitHub"}
                <BsArrowUpRightCircle size={16} />
              </Link>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
