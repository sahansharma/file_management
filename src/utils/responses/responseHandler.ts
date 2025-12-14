import { Response } from "express";
import { SuccessResponse } from "./successResponse";
import { ErrorResponse } from "./errorResponse";

function safeReplacer(_key: string, value: any) {
    if (typeof value === "bigint") {
        return value.toString();
    }
    return value;
}

function sendJson(res: Response, status: number, payload: any) {
    const json = JSON.stringify(payload, safeReplacer);
    res.status(status).set("Content-Type", "application/json").send(json);
}

export class ResponseHandler {
    static success<T>(res: Response, data: T, message?: string, status = 200) {
        const payload = new SuccessResponse(data, message);
        return sendJson(res, status, payload);
    }

    static error(res: Response, message?: string, error?: string, status = 400, validationErrors?: any[]) {
        const payload = new ErrorResponse(message, error || "Error processing request", validationErrors);
        return sendJson(res, status, payload);
    }
}