class ApiError extends Error {
    constructor(
        statusCode,
        message="Somthing went wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null
        this.message = message
        this.stack = stack
        if (stack){
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}