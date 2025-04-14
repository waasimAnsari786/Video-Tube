import multer from "multer";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";

const errorHandler = (err, _, res, next) => {
  // --- Multer Error Handling ---
  if (err instanceof multer.MulterError) {
    console.log(err);

    const multerErrorMessages = {
      LIMIT_FILE_SIZE: "File size too large. Please upload a smaller file.",
      LIMIT_FILE_COUNT:
        "Too many files uploaded. Please upload only the allowed number.",
      LIMIT_UNEXPECTED_FILE:
        "Unexpected file field. Please check the field name and try again.",
    };

    const friendlyMessage =
      multerErrorMessages[err.code] || "File upload error occurred.";

    return res.status(400).json(new ApiResponse(400, null, friendlyMessage));
  }

  // --- Custom API Error ---
  else if (err instanceof ApiError) {
    console.log(err);
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, null, err.message));
  }

  // --- MongoDB Validation Error ---
  else if (err.name === "ValidationError") {
    console.log(err);

    const errors = Object.values(err.errors).map(error => error.message);

    return res.status(400).json({
      data: null,
      success: false,
      message: "Validation Error",
      errors: errors,
    });
  }

  // --- JWT Errors ---
  else if (
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError"
  ) {
    console.log(err);
    return res.status(400).json(new ApiResponse(400, null, err.message));
  }

  // --- Fallback for Unknown Errors ---
  else {
    console.log("Unhandled error:", err.name);
    console.log(err);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong on the server."));
  }
};

export default errorHandler;
