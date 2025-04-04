import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import checkFields from "../utils/checkFields.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // extract title, description, videostatus from req.body
  // extract video and thumbnail from req.files
  // check has all of the data valid values?
  // upload files on cloudinary
  // save files and text data in video collection
  // return response

  try {
    const { title, description, videoStatus } = req.body;
    const { video, thumbnail } = req.files;

    if (checkFields([title, description])) {
      throw new ApiError(400, "Title and description is required");
    }

    const videoLocalPath = video[0].path;

    if (!videoLocalPath) {
      throw new ApiError(400, "Video local path is missing");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath, "video");

    const thumbnailLocalPath = thumbnail[0].path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail local path is missing");
    }
    const uploadedThumbnail = await uploadOnCloudinary(
      thumbnailLocalPath,
      "image"
    );
  } catch (error) {
    for (const file in req.files) {
      deleteFileFromLocalServer(req.files[file][0].path);
    }
    throw new ApiError(error.statusCode, error.message);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
