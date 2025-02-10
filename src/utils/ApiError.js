class ApiError extends Error { // Custom API Error class that extends the built-in Error class
    constructor(
        statusCode, // Parameter to store HTTP status code for the error response
        message="Somthing went wrong", // Default error message if none is provided during instantiation
        errors = [], // Array to store multiple error messages or validation details
        stack = "" // Stack trace string for debugging purposes
    ){
        super(message); // Call the parent Error class constructor with the error message
        this.statusCode = statusCode; // Assign the HTTP status code to the instance property
        this.errors = errors; // Store the array of error details in the instance property
        this.data = null // Initialize data property as null for consistency
        this.message = message // Store the error message in the instance property
        this.stack = stack // Initially set the stack trace from the parameter
        if (stack){ // If a stack trace is provided in the constructor
            this.stack = stack // Use the provided stack trace
        }
        else {
            Error.captureStackTrace(this, this.constructor); // Automatically generate a stack trace if none provided
        }
    }}

export {ApiError} // Export the ApiError class for use in other modules