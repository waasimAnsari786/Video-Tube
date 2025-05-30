// a utility class for sending errors to frontend
class ApiError extends Error {
  constructor(
    // get some mendatory data on each creation of instance
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // call parent class's constructor
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // condition for defining manual stack trace of user if it exists else store built-in stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
