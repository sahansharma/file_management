import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/responses/responseHandler";
import { ApiError } from "../utils/errors/apiError";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError){
        ResponseHandler.error(
        res,
        err.message || "Internal Server Error",
        err.message || "An unexpected error occurred",
        err.statusCode || 500,
        err.validationErrors || []
    );
    } else{
        console.error(err);
        ResponseHandler.error(
            res,
            "Server Error",
            err.message || "Unknown error",
            500
        );
    }
};