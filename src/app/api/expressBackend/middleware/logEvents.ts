import * as uuid from "uuid";
import * as datefns from "date-fns";
import fs from "node:fs";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";

export async function logEvents(
  message: string,
  logName: string,
): Promise<void> {
  const dateTime = `${datefns.format(new Date(), "ddMMyyyy\tHH:mm:ss")}`;
  const theLog = `${uuid.v4()}\t${dateTime}\t${message}\n`;
  console.log(theLog);

  try {
    if (!fs.existsSync(path.join(process.cwd(), "logs"))) {
      await fs.promises.mkdir(path.join(process.cwd(), "logs"));
    }
    await fs.promises.appendFile(
      path.join(process.cwd(), "logs", logName),
      theLog,
    );
  } catch (err) {
    console.error(err);
  }
}

export function logger(req: Request, res: Response, next: NextFunction): void {
  logEvents(
    `${req.method}\t${req.headers.origin ?? ""}\t${req.url}`,
    "reqLog.txt",
  );
  console.log(`${req.method} ${req.path}`);
  next();
}
