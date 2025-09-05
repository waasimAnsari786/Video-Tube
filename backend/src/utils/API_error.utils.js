class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errorCode = "INTERNAL_SERVER_ERROR",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode; // 🔑 stable error code for client-side handling
    this.errors = errors; // optional detailed validation errors
    this.success = false;
    this.isOperational = true; // 🔑 distinguish operational vs programming bugs

    // capture stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
