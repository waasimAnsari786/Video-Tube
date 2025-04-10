import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import checkFields from "../utils/checkFields.utils.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import Video from "../models/video.model.js";
import FileDetails from "../utils/fileObject.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import { IMAGE_EXTENTIONS, VIDEO_EXTENTIONS } from "../constants.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // extract title, description, videostatus from req.body
  // extract video and thumbnail from req.files
  // check do all of the data have valid values?
  // check - video field must contain video and thumbnail must constain image
  // upload files on cloudinary
  // save files and text data in video collection
  // return response

  try {
    const { title, description, videoStatus } = req.body;
    const { video, thumbnail } = req.files;

    /* "checkFields" is a utility function for validating those files which
    contains data except files. It returns "Boolean" value */
    if (checkFields([title, description])) {
      throw new ApiError(400, "Title and description are required");
    }

    // extract video and thumbnail's local file path
    const videoLocalPath = video[0].path;
    // used "?." optional chaining operator because thumbnail is optional
    const thumbnailLocalPath = thumbnail?.[0]?.path;

    // throw error if local paths will miss or empty
    if (!videoLocalPath) {
      throw new ApiError(400, "Video local path is required");
    }

    if (!VIDEO_EXTENTIONS.includes(video[0].realFileType)) {
      throw new ApiError(400, "Video field must contain video file");
    }

    if (thumbnail && !IMAGE_EXTENTIONS.includes(thumbnail?.[0]?.realFileType)) {
      throw new ApiError(400, "Thumbnail field must contain image file");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath, "video");

    if (!uploadedVideo) {
      throw new ApiError(
        500,
        "Internal server error while uploading video on cloudinary"
      );
    }

    let uploadedThumbnail = null;

    if (thumbnail && thumbnailLocalPath) {
      uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");
    }

    /*"uploadedVideoDetails" and "uploadedThumbnailDetails" are instances of "FileDetails" class, 
    which has created for storing uploaded file details in a structured way so that it can be 
    use for saving it in "Video" collection's each created document's "video" and "thumbnail"
    fields */
    const uploadedVideoDetails = new FileDetails(
      uploadedVideo.secure_url,
      uploadedVideo.resource_type,
      uploadedVideo.public_id
    );

    console.log("uploaded video details ", uploadedVideoDetails);

    const uploadedThumbnailDetails = uploadedThumbnail
      ? new FileDetails(
          uploadedThumbnail.secure_url,
          uploadedThumbnail.resource_type,
          uploadedThumbnail.public_id
        )
      : null;

    const createdVideo = await Video.create({
      title,
      description,
      videoStatus,
      video: uploadedVideoDetails,
      thumbnail: uploadedThumbnailDetails || null,
      owner: req.user._id,
      duration: uploadedVideo.duration,
    });

    console.log("created video ", createdVideo);

    if (!createdVideo) {
      throw new ApiError(500, "Internal server error while creating video");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, createdVideo, "Video has created succesfully")
      );
  } catch (error) {
    for (const file in req.files) {
      deleteFileFromLocalServer(req.files[file][0].path);
    }
    throw error;
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  // extract videoID from req.param and text data from req.body
  // check - is videoId valid?
  // check all provided data of user must contain valid values
  // get video from provided videoId
  // save details in the video document
  // return response
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const { title, description } = req.body;

  if (checkFields([title, description])) {
    throw new ApiError(400, "Title and description are required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video with the requested id doesn't exist");
  }

  video.title = title;
  video.description = description;

  const updatedVideo = await video.save();
  console.log("updated video for it's details ", updatedVideo);

  if (!updatedVideo) {
    throw new ApiError(500, "Internal server error while updating video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video has been updated successfully")
    );
});

const updateVideoAndThumbnail = asyncHandler(async (req, res, _) => {
  // extract "videoId" from req.params
  // check - is videoId valid?
  // check - is requested file's extension valid?
  // get video from vdieo id
  /* check - video has already that file in the the related field which will
  be update in this request*/
  // upload file on cloudinary
  // save the response in DB
  // check for previous file
  // if previous file exists, delete it
  // return response

  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    /* initialize variable for using requested file's field name in the form in frontend because
    form's fieldname matches with my DB's fieldname */
    const fieldName = req.file.fieldname;

    if (
      fieldName === "thumbnail" &&
      !IMAGE_EXTENTIONS.includes(`.${req.file.realFileType}`)
    ) {
      throw new ApiError(
        400,
        `Invalid file type "${req.file.realFileType}" of requested file ${fieldName}: Allowed ${IMAGE_EXTENTIONS.join(", ")}`
      );
    } else if (
      fieldName === "video" &&
      !VIDEO_EXTENTIONS.includes(`.${req.file.realFileType}`)
    ) {
      throw new ApiError(
        400,
        `Invalid file type "${req.file.realFileType}" of requested file ${fieldName}: Allowed ${VIDEO_EXTENTIONS.join(", ")}`
      );
    }

    const videoDoc = await Video.findById(videoId);

    if (!videoDoc) {
      throw new ApiError(400, "Video with the requested id doesn't exist");
    }
    // user's previous file
    const prevFile = videoDoc[fieldName];

    /*initialize this variable for storing resource-type or type for file to be uploaded.
    Because "uploadOnCloudinary()" method expects 2 arguments, file's to be uploaded
    local-path and type*/
    let resourceType = fieldName === "thumbnail" ? "image" : "video";

    const uploadedFile = await uploadOnCloudinary(req.file.path, resourceType);
    console.log("uploaded file", uploadedFile);

    if (!uploadedFile) {
      throw new ApiError(500, "Internal server error while uploading file");
    }

    /*"fileDetails" is instance of "FileDetails" class, which has created for storing
    uploaded file details in a structured way so that it can be use for saving it in
    "Video" collection's each created document's "video" and "thumbnail" fields */
    const fileDetails = new FileDetails(
      uploadedFile.secure_url,
      uploadedFile.resource_type,
      uploadedFile.public_id
    );

    videoDoc[fieldName] = fileDetails;

    if (fieldName === "video") {
      videoDoc.duration = uploadedFile.duration;
    }

    const updatedVideo = await videoDoc.save();
    console.log("updated video ", updatedVideo);

    if (!updatedVideo) {
      throw new ApiError(
        500,
        "Internal server error while updating video after file uploading"
      );
    }

    // previous file deletion
    if (prevFile?.secureURL) {
      const deletedFile = await deleteFromCloudinary(
        prevFile?.publicId,
        prevFile?.resourceType
      );
      if (!deletedFile) {
        throw new ApiError(
          500,
          `Internal server error while deleting previous ${fieldName}`
        );
      }
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          fileDetails,
          `${fieldName} has updated successfully`
        )
      );
  } catch (error) {
    deleteFileFromLocalServer(req.file.path);
    throw error;
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  // extract video Id from req.params
  // check - is videoId valid?
  // get video from videoId
  // if video exists, delete it
  // if video will be deleted successfully, delete video and thumbnail file from cloudinary too.
  // return response
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const videoDoc = await Video.findById(videoId);

    if (!videoDoc) {
      throw new ApiError(404, "Video with the requested id doesn't exist");
    }

    const { video, thumbnail } = videoDoc;

    const deletedVideo = await videoDoc.deleteOne();

    console.log("deleted video ", deletedVideo);

    const [deletedVideoFile, deletedThumbnailFile] = await Promise.all([
      deleteFromCloudinary(video.publicId, video.resourceType),
      deleteFromCloudinary(thumbnail.publicId, thumbnail.resourceType),
    ]);

    if (!deletedVideoFile || !deletedThumbnailFile) {
      throw new ApiError(
        500,
        "Video deleted from DB, but there was a problem deleting files from Cloudinary"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video has been deleted successfully"));
  } catch (error) {
    throw error;
  }
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // extract videoId from req.params
  // extract video status from req.body
  // Make 1st character of veideoSatus uppercase which user has provided
  // get the video
  /* check - if video has video-status same as provided, return response
  else update videoStatus and then return response*/

  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const { videoStatus } = req.body;

    if (!videoStatus) {
      throw new ApiError(400, "Video status is required");
    }

    const normalizedStatus =
      videoStatus.charAt(0).toUpperCase() + videoStatus.slice(1).toLowerCase(); // "public" → "Public"

    const videoDoc = await Video.findById(videoId);

    if (!videoDoc) {
      throw new ApiError(404, "Video with the requested id doesn't exist");
    }

    if (videoDoc.videoStatus === normalizedStatus) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            videoDoc,
            "Video status is already set to the provided value"
          )
        );
    }

    videoDoc.videoStatus = normalizedStatus;

    const updatedVideo = await videoDoc.save();

    if (!updatedVideo) {
      throw new ApiError(
        500,
        "Internal server error while updating video status"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVideo,
          "Video status has been updated successfully"
        )
      );
  } catch (error) {
    throw error;
  }
});

export {
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideoDetails,
  updateVideoAndThumbnail,
  deleteVideo,
  togglePublishStatus,
};
