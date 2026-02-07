"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className={cn(
        " px-10",
        " sm:px-16",
        " sm:items-start",
        "grid grid-rows-[1fr_auto_1fr]",
        "gap-10 sm:gap-10",
        "",
        "",
        "",
      )}
    >
      <div
        id="project-header"
        className={cn(
          "flex flex-col w-full  sm:flex-row sm:justify-between items-center gap-5",
          "",
          "",
        )}
      >
        <Image
          className={cn(
            "h-50",
            "w-100",
            "h-full w-full",
            "min-h-10 min-w-30",
            "max-h-30 max-w-40",
            // "dark:brightness-300",
            // "dark:opacity-70",
            // "dark:saturate-90",
            "dark:opacity-90",
            "dark:brightness-120",
            "dark:saturate-70",
            "",

            "",
            "",
          )}
          src="/logo.png"
          alt="ToDo logo"
          width={200}
          height={200}
          priority
        />
        <Card
          className={cn(
            "p-5 text-md leading-0 text-stone-600 dark:text-stone-400 w-full h-fit ",
            "min-w-fit",
            "max-w-100",
            "text-nowrap",
            "",
            "",
          )}
        >
          <p className="flex flex-row justify-between">
            <span>Assignment:</span>
            <span> Bygg et API med Expres</span>
          </p>
          <p className="flex flex-row justify-between">
            <span>Module:</span>
            <span> 4, fullstack</span>
          </p>
          <p className="flex flex-row justify-between">
            <span>Chosen theme:</span>
            <span> Todo App</span>
          </p>
        </Card>
      </div>

      <div
        id="project-description"
        className="flex flex-col  gap-5 items-start "
        // className="flex flex-col items-center gap-5  sm:items-start sm:text-left text-start"
      >
        <h1
          suppressHydrationWarning
          className={cn(
            // "max-w-xs text-3xl font-semibold  tracking-tight text-black dark:text-stone-50",
            "max-w-xs text-3xl font-semibold  tracking-tight ",
            "",
            "",
          )}
        >
          Welcome to 2Do
        </h1>
        <p
          className={cn(
            // "max-w-md text-lg leading-8 text-stone-600 dark:text-stone-400",
            "max-w-md text-lg leading-8 text-stone-600 dark:text-stone-400",
            "",
            "",
          )}
        >
          An app for managing tasks, powered by{" "}
          <a
            href="https://nextjs.org"
            className={cn(
              "font-medium text-stone-950 dark:text-stone-50",
              "",
              "",
            )}
          >
            NEXTjs
          </a>
          , with backend handling by{" "}
          <a
            href="https://expressjs.com/"
            className={cn(
              "font-medium text-stone-950 dark:text-stone-50",
              "",
              "",
            )}
          >
            Express
          </a>
          , database by{" "}
          <a
            href="https://www.sqlite.org/"
            className={cn(
              "font-medium text-stone-950 dark:text-stone-50",
              "",
              "",
            )}
          >
            SQLite{" "}
          </a>
          both with and without using{" "}
          <a
            href="https://www.prisma.io/"
            className={cn(
              "font-medium text-stone-950 dark:text-stone-50",
              "",
              "",
            )}
          >
            Prisma
          </a>
          , designed with the{" "}
          <a
            href="https://ui.shadcn.com/"
            className={cn(
              "font-medium text-stone-950 dark:text-stone-50",
              "",
              "",
            )}
          >
            Ui.ShadCn
          </a>{" "}
          UI Kit.
        </p>
        <div>
          <p
            className={cn(
              "max-w-md text-lg leading-5 text-stone-600 dark:text-stone-400",
              "text-start",
              "",
              "",
            )}
          >
            With the goal of the task is to display capabilities for:
          </p>
          <ul
            className={cn(
              "list-disc pl-5 text-stone-600 dark:text-stone-400",
              "px-10",
              "",
              "",
            )}
          >
            <li className="text-start">REST-ful API construction</li>
            <li className="text-start">Node + Express</li>
            <li className="text-start">API handling</li>
            <li className="text-start">Authentication.</li>
          </ul>
        </div>
      </div>

      <div
        id="project-routes"
        className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left"
      >
        <h3 className="text-2xl leading-10 text-stone-600 dark:text-stone-300 self-start">
          Pages
        </h3>
        <hr className="border-t  w-full border-stone-400 dark:border-white/[.145]" />
        <div className="flex flex-col w-full gap-4 text-base font-medium sm:flex-row ">
          <Link
            className={cn(
              "w-full sm:w-1/2 shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
              "",
              "",
            )}
            // href={"/todo"} //should redirect to login first

            href={"/todo"}
          >
            ToDo (Prisma)
          </Link>
          <Link
            className={cn(
              "w-full sm:w-1/2 shadow-md hover:shadow-xs flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
              "",
              "",
            )}
            // href={"/expressTodo"} //should redirect to login first

            href={"/expressTodo"}
          >
            ToDo (Express)
          </Link>
        </div>
      </div>
    </div>
  );
}
