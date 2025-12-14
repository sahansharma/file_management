import {Response} from "express";
import { SuccessResponse } from "./successResponse";
import { ErrorResponse } from "./errorResponse";

export class ResponseHandler{
    static success<T>(
        res: Response,
        data: T,
        message?: string,
        status = 200
    ){
        return res
            .status(status)
            .json(new SuccessResponse(data, message));
    }

    static error(
        res: Response,
        message?: string,
        error?: string,
        status = 400,
        validationErrors?: any[]
    ){
        return res
            .status(status)
            .json(
                new ErrorResponse(message, error || "Error processing request", validationErrors)
            );
    }
}