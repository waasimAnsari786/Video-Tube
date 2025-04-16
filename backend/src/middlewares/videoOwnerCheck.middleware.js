import mongoose from "mongoose";
import Video from "../models/video.model.js";
import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const videoOwnerCheck = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  // "videoDoc stands for Video Document"
  const videoDoc = await Video.findById(videoId);

  if (!videoDoc) {
    throw new ApiError(404, "Video with the requested id doesn't exist");
  }

  // if (mongoose.Types.ObjectId(videoDoc.owner).equals(req.user._id)) {
  if (!videoDoc.owner.equals(req.user._id)) {
    throw new ApiError(
      400,
      "You're not the owner of this video. You can't make changes in it."
    );
  }

  req.videoDoc = videoDoc;

  next();
});

export default videoOwnerCheck;
