import asyncHandler from "../utils/asyncHandler.utils.js";
import { checkObjectID } from "../utils/checkFields.utils.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import Like from "../models/like.model.js";

export const toggleLike = asyncHandler(async (req, res) => {
  try {
    // [1] Extract required data from request
    const { targetId } = req.body;

    // [3] Check if targetId is a valid MongoDB ObjectId
    checkObjectID(targetId, "Invalid target ID");

    // [4] Check if like already exists
    const existingLike = await Like.findOne({
      owner: req.user._id,
      targetId,
    });

    let message = "";

    if (existingLike) {
      // [5] If exists, remove it (unlike)
      await existingLike.deleteOne();
      message = "Like removed successfully";
    } else {
      // [6] If not, create new like (like)
      await Like.create({
        owner: req.user._id,
        targetId,
      });
      message = "Like added successfully";
    }

    // [7] Return response
    return res.status(200).json(new ApiResponse(200, null, message));
  } catch (error) {
    throw error;
  }
});
