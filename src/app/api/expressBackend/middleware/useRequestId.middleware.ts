import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";
/*
This is an Express middleware that generates a unique request ID for each incoming HTTP request. 
It uses Node's crypto module to create a UUID and attaches it to the request headers as X-Request-Id. 
This ID can be used for logging, tracing, or debugging requests as they move through your application.
*/
const useRequestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = crypto.randomUUID();
  req.headers["X-Request-Id"] = requestId;
  next();
};

export { useRequestId };
