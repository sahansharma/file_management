import { ApiResponse } from "./apiResponse";

export class SuccessResponse<T> extends ApiResponse{
    data: T;

    constructor(
        data: T,
        message = "Request processed successfully"
    ){
        super(true, message);
        this.data = data;
    }
}