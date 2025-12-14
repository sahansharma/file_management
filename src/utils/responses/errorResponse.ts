import { ApiResponse } from "./apiResponse";

export class ErrorResponse extends ApiResponse {
  error?: string;
  validationErrors?: any[];

  constructor(
    message?: string,
    error?: string,
    validationErrors?: any[]
  ) {
    super(false, message ?? "Error processing request");
    this.error = error;
    this.validationErrors = validationErrors;
  }
}
