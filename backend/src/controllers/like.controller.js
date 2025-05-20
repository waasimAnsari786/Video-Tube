import asyncHandler from "../utils/asyncHandler.utils.js";
import { checkObjectID } from "../utils/checkFields.utils.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import Like from "../models/like.model.js";
import { getModelByName } from "../utils/getModel.utils.js";

const toggleLike = asyncHandler(async (req, res) => {
  const { targetId, modelName } = req.params;

  // [1] Validate targetId
  checkObjectID(targetId, "Invalid target ID");

  // [2] Resolve model from name
  const TargetModel = getModelByName(modelName);
  if (!TargetModel) {
    throw new ApiError(400, "Invalid model type provided");
  }

  // [3] Check if target exists
  const isTargetExists = await TargetModel.findById(targetId);
  if (!isTargetExists) {
    throw new ApiError(404, "Target with given id not found");
  }

  // [4] Check for existing like
  const existingLike = await Like.findOne({
    owner: req.user._id,
    targetId,
  });

  if (req.method === "POST") {
    if (existingLike) {
      return res
        .status(409)
        .json(new ApiResponse(409, { isLiked: true }, "Already liked"));
    }

    await Like.create({
      owner: req.user._id,
      targetId,
    });

    const totalLikes = await Like.countDocuments({ targetId });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true, totalLikes },
          "Like added successfully"
        )
      );
  }

  if (req.method === "DELETE") {
    if (!existingLike) {
      return res
        .status(404)
        .json(new ApiResponse(404, { isLiked: false }, "Not liked yet"));
    }

    await existingLike.deleteOne();

    const totalLikes = await Like.countDocuments({ targetId });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false, totalLikes },
          "Like removed successfully"
        )
      );
  }

  throw new ApiError(405, "Method not allowed on this route");
});

export { toggleLike };
