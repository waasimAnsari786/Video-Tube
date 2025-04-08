import multer from "multer";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";

const errorHandler = (err, _, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log(err);
    return res.status(400).json(new ApiResponse(400, null, err.code));
  } else if (err instanceof ApiError) {
    console.log(err);
    return res.status(400).json(new ApiResponse(400, null, err.message));
    // display errors of Database
  } else if (err.name === "ValidationError") {
    console.log(err);
    // extracting error messages come from mongoDB
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      data: null,
      success: false,
      message: "Validation Error",
      errors: errors,
    });
  } else if (
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError"
  ) {
    return res.status(400).json(new ApiResponse(400, null, err.message));
  } else {
    console.log("error name ", err.name);
    console.log(err);
    return res.status(401).json(new ApiResponse(401, null, err.message));
  }
};
export default errorHandler;
