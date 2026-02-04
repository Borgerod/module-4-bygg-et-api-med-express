import express from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "@/app/api/expressBackend/middleware/logEvents";
import { useRequestId } from "@/app/api/expressBackend/middleware/useRequestId.middleware";

const whitelist = [
  "https://www.minHjemmeside.com",
  "http://127.0.0.1:5500",
  "http://localhost:4000",
  "http://localhost:3000",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS!"));
    }
  },
  optionsSuccessStatus: 200,
};

export function configureApp(app: express.Application): void {
  app.use(express.urlencoded({ extended: false }));
  app.use(useRequestId);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use(cors(corsOptions));
  app.use(logger);
}
