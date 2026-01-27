import { Card } from "@/components/ui/card";
import { cn } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // <div className="flex min-h-screen items-center justify-center  font-sans bg-transparent">

    <main
      className={cn(
        // "flex w-full flex-col items-center justify-between",
        // "max-w-3xl",
        // // "min-h-screen",
        // //   "min-h-auto",
        // "min-h-fit",
        // "min-h-full",
        // "max-h-fit",
        // "h-full",
        // //   "h-fit",
        // //   "max-h-screen",
        " sm:py-32",
        " px-10",
        " sm:px-16",
        "dark:bg-black sm:items-start",
        // // "dark:bg-black sm:content-between",
        // "content-around",

        // "flex w-full flex-col ",
        // "grid grid-rows-3",
        // "grid grid-rows-3",
        "grid grid-rows-[1fr_auto_1fr]",
        "gap-10 sm:gap-0",
        // "h-full",
        // "min-h-10",
        // "items-center",
        // "justify-between",
        // "justify-around",
        // "content-between",
        "",
        "",
        "",
      )}
    >
      {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}

      <div
        id="project-header"
        className="flex flex-col w-full  sm:flex-row sm:justify-between items-center"
      >
        <Image
          className={cn(
            //   "dark:invert",
            "h-50 w-50",
            "h-full w-full",
            "min-h-20 min-w-20",
            "max-h-40 max-w-40",
            "aspect-square",

            "",
            "",
          )}
          src="/favicon.ico"
          alt="ToDo logo"
          width={100}
          height={100}
          priority
        />
        <Card
          className={cn(
            "p-5 text-md leading-0 text-zinc-600 dark:text-zinc-400 w-full h-fit ",
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
        className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left text-left"
      >
        <h1
          suppressHydrationWarning
          className={cn(
            "max-w-xs text-3xl font-semibold  tracking-tight text-black dark:text-zinc-50",
            "",
            "",
          )}
        >
          Welcome to 2Do
        </h1>
        <p
          className={cn(
            "max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400",
            "",
            "",
          )}
        >
          An app for managing tasks, powered by{" "}
          <a
            href="https://nextjs.org"
            className={cn(
              "font-medium text-zinc-950 dark:text-zinc-50",
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
              "font-medium text-zinc-950 dark:text-zinc-50",
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
              "font-medium text-zinc-950 dark:text-zinc-50",
              "",
              "",
            )}
          >
            SQLite{" "}
          </a>
          {/* via{" "} */}
          both with and without using{" "}
          <a
            href="https://www.prisma.io/"
            className={cn(
              "font-medium text-zinc-950 dark:text-zinc-50",
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
              "font-medium text-zinc-950 dark:text-zinc-50",
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
              "max-w-md text-lg leading-5 text-zinc-600 dark:text-zinc-400",
              "text-start",
              "",
              "",
            )}
          >
            With the goal of the task is to display capabilities for:
          </p>
          <ul
            className={cn(
              "list-disc pl-5 text-zinc-600 dark:text-zinc-400",
              // "place-self-center",
              // "sm:place-self-start",
              // " sm:px-10",
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
        <h3 className="text-2xl leading-10 text-stone-600 self-start">Pages</h3>
        <hr className="border-t  w-full border-stone-400" />
        <div className="flex flex-col w-full gap-4 text-base font-medium sm:flex-row ">
          <Link
            className="w-full sm:w-1/2 shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90"
            href={"/todo"}
          >
            ToDo (Prisma)
          </Link>
          <Link
            className="w-full sm:w-1/2 shadow-md hover:shadow-xs flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90"
            href={"/expressTodo"}
          >
            ToDo (Express)
          </Link>
        </div>
      </div>
    </main>
  );
}
