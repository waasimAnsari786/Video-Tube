import multer from "multer";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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
      .json(new ApiResponse(400, null, friendlyMessage, "UPLOAD_ERROR"));
  }

  // --- Custom API Error ---
  else if (err instanceof ApiError) {
    console.error("API Error:", err);

    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message, // readable message
      errorCode: err.errorCode, // stable code for client handling
      errors: err.errors || [], // extra details (like validation issues)
    });
  }

  // --- MongoDB Validation Error ---
  else if (err.name === "ValidationError") {
    console.error("Mongoose Validation Error:", err);

    const errors = Object.values(err.errors).map(error => error.message);

    return res.status(400).json({
      success: false,
      data: null,
      message: "Validation Error",
      errorCode: "VALIDATION_ERROR",
      errors,
    });
  }

  // --- JWT Errors ---
  else if (
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError"
  ) {
    console.error("JWT Error:", err);

    return res.status(401).json({
      success: false,
      data: null,
      message: err.message,
      errorCode: "INVALID_OR_EXPIRED_TOKEN",
    });
  }
  // --- Mongoose CastError Handling ---
  else if (err.name === "CastError") {
    console.error("Mongoose CastError:", err);

    return res.status(400).json({
      success: false,
      data: null,
      message: `Invalid value '${err.value}' for field '${err.path}'. Expected type: ${err.kind}.`,
      errorCode: "INVALID_DATA_TYPE",
    });
  }

  // --- Fallback for Unknown Errors ---
  else {
    console.error("Unhandled Error:", err);

    return res.status(500).json({
      success: false,
      data: null,
      message: "Something went wrong on the server.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

export default errorHandler;
