// Class to handle API responses
class ApiResponse{
    // Constructor takes statusCode, data and optional message parameter
    constructor(statusCode, data, message = "success"){
        // Set the status code of the response
        this.statusCode = statusCode
        // Store the data payload of the response
        this.data = data
        // Set the message, defaults to "success" if not provided
        this.message = message
        // Determine if response is successful based on status code (< 400 means success)
        this.success = statusCode < 400
    } 
}
export {ApiResponse}