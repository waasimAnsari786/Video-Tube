import multer from "multer";
import ApiError from "../utils/API_error.utils.js";

const errorHandler = (err, _, res, next) => {
  // display errors of multer
  if (err instanceof multer.MulterError) {
    console.log(err);
    return res
      .status(400)
      .json({ data: null, success: false, message: err.code });
    // display custom errors of ApiErrors
  } else if (err instanceof ApiError) {
    console.log(err);
    return res.status(400).json({ ...err, message: err.message });
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
    return res
      .status(401)
      .json({ data: null, success: false, message: err.message });
  } else {
    console.log("error name ", err.name);
    console.log(err);

    return res
      .status(401)
      .json({ data: null, success: false, message: err.message });
  }
};
export default errorHandler;
