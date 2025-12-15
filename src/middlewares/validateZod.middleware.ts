import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ResponseHandler } from "../utils/responses/responseHandler";
import StatusCodes from "../utils/statusCodes";

type Target = "body" | "params" | "query" | "all";

export const validateZod = (schema: ZodSchema<any>, target: Target = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (target === "all") {
        schema.parse({ body: req.body, params: req.params, query: req.query });
      } else if (target === "body") {
        schema.parse(req.body);
      } else if (target === "params") {
        schema.parse(req.params);
      } else if (target === "query") {
        schema.parse(req.query);
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues || [];
        const validationErrors = issues.map(i => ({ path: (i.path || []).join('.'), message: i.message }));
        return ResponseHandler.error(
          res,
          "Validation errors",
          "Invalid request payload",
          StatusCodes.UNPROCESSABLE_ENTITY,
          validationErrors
        );
      }
      next(err);
    }
  };
};
