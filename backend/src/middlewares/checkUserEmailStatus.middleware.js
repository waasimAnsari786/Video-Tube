import User from "../models/user.model.js";
import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const checkUserEmailStatus = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Ensure email is provided
  if (!email) {
    throw new ApiError(400, "Email is required for verifying it.");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(
      404,
      "User not found. Do signup first and then verify your email."
    );
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return res
      .status(200)
      .json({ success: true, message: "Email is already verified" });
  }

  // Attach user to req for downstream use
  req.user = user;

  next();
});

export default checkUserEmailStatus;
