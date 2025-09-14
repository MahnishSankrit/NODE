
class ApiError extends Error {                      // Define a new class ApiError that extends built-in Error
    constructor(                                  // Constructor method to create a new ApiError
        statusCode,                               // HTTP status code (e.g. 404, 500)
        message = " something went wrong",       // Error message with default text
        errors = [],                              // Array of detailed errors, defaults to empty array
        stack = ""                               // Optional stack trace string, defaults to empty
    ){
        super(message)                           // Call parent Error constructor with message
        this.statusCode = statusCode             // Save the status code on the error instance
        this.data = null                         // Initialize a data property as null (for extra info)
        this.message = message                   // Set the error message (redundant but explicit)
        this.success= false;                      // Flag to indicate failure, always false here
        this.errors = errors                      // Save the array of error details
        
        if(stack){                               // If a custom stack trace is provided
            this.stack = stack                    // Use the provided stack trace
        }else{
            Error.captureStackTrace(this, this.constructor)  // Otherwise generate stack trace automatically
        }
    }
}
export {ApiError}