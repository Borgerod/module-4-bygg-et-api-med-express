import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateRequest =
  ({
    bodySchema,
    paramSchema,
    querySchema,
    headerSchema,
  }: { [key: string]: ZodType } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (bodySchema) bodySchema.parse(req.body);
      if (paramSchema) paramSchema.parse(req.params);
      if (querySchema) querySchema.parse(req.query);
      if (headerSchema) headerSchema.parse(req.headers);

      console.log("[useValidate] Schema validation passed!");

      next();
    } catch (err) {
      console.error("UseValidateMiddlewareError:", err);
      res.sendStatus(400);
    }
  };
