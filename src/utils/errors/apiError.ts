export class ApiError extends Error {
    statusCode: number;
    validationErrors?: any[];

    constructor(message: string, statusCode = 500, validationErrors?: any[]){
        super(message);
        this.statusCode = statusCode;
        this.validationErrors = validationErrors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}