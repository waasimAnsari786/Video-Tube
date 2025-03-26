import multer from "multer";
import ApiError from "../utils/API_error.utils.js";

const errorHandler = (err, _, res, next) => {
  if (err instanceof multer.MulterError || err instanceof ApiError) {
    console.log(err);
    return res.status(400).json({ ...err, message: err.message });
  } else if (err.name === "ValidationError") {
    console.log(err);
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json(new ApiError(400, "Validation Error:", errors));
  }
};
export default errorHandler;
