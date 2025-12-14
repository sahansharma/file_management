export abstract class ApiResponse{
    success: boolean;
    message: string;

    protected constructor(success: boolean, message: string){
        this.success = success;
        this.message = message;
    }
}