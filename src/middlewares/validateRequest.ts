import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/responses/responseHandler";

type ValidatorFn = (payload: any) => { path: string; message: string }[] | null;

export const validateRequest = (validator: ValidatorFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validator({ body: req.body, params: req.params, query: req.query });
      if (errors && errors.length > 0) {
        return ResponseHandler.error(
          res,
          "Validation errors",
          "Invalid request payload",
          422,
          errors
        );
      }
      next();
    } catch (err: any) {
      next(err);
    }
  };
};
