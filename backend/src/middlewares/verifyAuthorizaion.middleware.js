import User from "../models/user.model.js";
import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";

const verifyAuthorizaion = asyncHandler(async (req, res, next) => {
  // get token if it exists in header or request. Throw error if it doesn't
  // decode token
  // get user by id.
  // if operation of getting user successul, pass next() middleware else throw error
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "Unauthorized Request: Access token is missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(400, "Access token has been expired or invalid");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      400,
      error.message || "Acccess token has been expired or invalid"
    );
  }
});
export default verifyAuthorizaion;
