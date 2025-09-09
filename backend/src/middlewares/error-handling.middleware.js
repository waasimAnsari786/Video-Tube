import multer from "multer";
import ApiError from "../utils/API_error.utils.js";
import ErrorResponse from "../utils/ErrorResponse.utils.js";

const errorHandler = (err, _, res, next) => {
  // --- Multer Error Handling ---
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err);

    const multerErrorMessages = {
      LIMIT_FILE_SIZE: "File size too large. Please upload a smaller file.",
      LIMIT_FILE_COUNT:
        "Too many files uploaded. Please upload only the allowed number.",
      LIMIT_UNEXPECTED_FILE:
        "Unexpected file field. Please check the field name and try again.",
    };

    const friendlyMessage =
      multerErrorMessages[err.code] || "File upload error occurred.";

    return res
      .status(400)
      .json(new ErrorResponse(400, friendlyMessage, err.code));
  }

  // --- Custom API Error ---
  else if (err instanceof ApiError) {
    console.error("API Error:", err);

    return res
      .status(err.statusCode)
      .json(
        new ErrorResponse(
          err.statusCode,
          err.message,
          err.errorCode,
          err.errors || []
        )
      );
  }

  // --- MongoDB Validation Error ---
  else if (err.name === "ValidationError") {
    console.error("Mongoose Validation Error:", err);

    const errors = Object.values(err.errors).map(error => error.message);

    return res
      .status(400)
      .json(
        new ErrorResponse(400, err.message, "MONGOOSE_VALIDATION_ERROR", errors)
      );
  }

  // --- JWT Errors ---
  else if (
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError"
  ) {
    console.error("JWT Error:", err);

    return res
      .status(401)
      .json(new ErrorResponse(401, err.message, "INVALID_OR_EXPIRED_TOKEN"));
  }

  // --- Mongoose CastError Handling ---
  else if (err.name === "CastError") {
    console.error("Mongoose CastError:", err);

    return res
      .status(400)
      .json(
        new ErrorResponse(
          400,
          `Invalid value '${err.value}' for field '${err.path}'. Expected type: ${err.kind}.`,
          "MONGOOSE_INVALID_DATA_TYPE"
        )
      );
  }

  // --- Fallback for Unknown Errors ---
  else {
    console.error("Unhandled Error:", err);

    return res
      .status(500)
      .json(
        new ErrorResponse(
          500,
          "Something went wrong on the server.",
          "INTERNAL_SERVER_ERROR"
        )
      );
  }
};

export default errorHandler;
