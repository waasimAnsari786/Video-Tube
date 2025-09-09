// a utility class for sending error responses to frontend
class ErrorResponse {
  constructor(
    statusCode,
    message = "An error occurred",
    errorCode = "UNKNOWN_ERROR",
    errors = []
  ) {
    this.statusCode = statusCode;
    this.success = false;
    this.data = null;
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export default ErrorResponse;
