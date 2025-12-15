import { z } from "zod";
import { ResponseHandler } from "../utils/responses/responseHandler";
import StatusCodes from "../utils/statusCodes";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: z.ZodSchema, property: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (err: any) {
      const issues = err?.issues || [];
      const validationErrors = issues.map((i: any) => ({ path: (i.path || []).join('.'), message: i.message }));
      return ResponseHandler.error(res, "Validation errors", "Invalid request payload", StatusCodes.UNPROCESSABLE_ENTITY, validationErrors);
    }
  };
