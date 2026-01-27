import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  ({
    bodySchema,
    paramSchema,
    querySchema,
    headerSchema,
  }: { [key: string]: ZodType } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      bodySchema && bodySchema.parse(req.body);
      paramSchema && paramSchema.parse(req.params);
      querySchema && querySchema.parse(req.query);
      headerSchema && headerSchema.parse(req.header);

      console.log("[useValidate] Schema validation passed!");

      next();
    } catch (err) {
      console.error("UseValidateMiddlewareError:", err);
      res.sendStatus(400);
    }
  };

export { validateRequest };
