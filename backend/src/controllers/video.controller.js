import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import { checkFields, checkObjectID } from "../utils/checkFields.utils.js";
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
import User from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortType = -1,
    } = req.query;

    const countAggregate = Video.aggregate([
      { $match: { videoStatus: "Public" } },
    ]);

    const options = {
      page,
      limit,
      sort: { [sortBy]: sortType },
      countQuery: countAggregate,
    };

    const myAggregate = [
      { $match: { videoStatus: "Public" } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                userName: 1,
                fullName: 1,
                "avatar.secureURL": 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          title: 1,
          "video.secureURL": 1,
          "thumbnail.secureURL": 1,
          views: 1,
          duration: 1,
          owner: 1,
        },
      },
      { $unwind: "$owner" },
    ];

    const videos = await Video.aggregatePaginate(myAggregate, options);

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  } catch (error) {
    throw error;
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  // extract title, description, videostatus from req.body
  // extract video and thumbnail from req.files
  // check - all of the data have valid values?
  // check - video field must contain video and thumbnail must constain image
  // upload files on cloudinary
  // save files and text data in video collection
  // return response

  try {
    const { title, description, videoStatus } = req.body;
    const { video, thumbnail } = req.files;

    checkFields(
      [title, description, videoStatus],
      "Title, description, and Video-status are required"
    );

    const normalizedStatus =
      videoStatus.charAt(0).toUpperCase() + videoStatus.slice(1).toLowerCase(); // "public" → "Public"

    // extract video and thumbnail's local file path
    const videoLocalPath = video?.[0]?.path;
    // used "?." optional chaining operator because thumbnail is optional
    const thumbnailLocalPath = thumbnail?.[0]?.path;

    // throw error if local paths will miss or empty
    if (!videoLocalPath) {
      throw new ApiError(400, "Video is required");
    }

    if (!VIDEO_EXTENTIONS.includes(`.${video[0].realFileType}`)) {
      throw new ApiError(400, "Video field must contain video file");
    }

    if (
      thumbnail &&
      !IMAGE_EXTENTIONS.includes(`.${thumbnail?.[0]?.realFileType}`)
    ) {
      throw new ApiError(400, "Thumbnail field must contain image file");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath, "video");

    // initialize this variable for storing uploaded result of thumbnail
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

    /* If thumbnail successfully uploads, this variable will contain necessary details
    for saving it in DB otherwise it will be null*/
    const uploadedThumbnailDetails = uploadedThumbnail
      ? new FileDetails(
          uploadedThumbnail.secure_url,
          uploadedThumbnail.resource_type,
          uploadedThumbnail.public_id
        )
      : null;

    /*I'm saving "uploadedThumbnailDetails" in DB, it doesn't cause issues because if thumbnail
      will be uploaded successfully then "uploadedeThumbnailDetails" varibale will contain
      thumbnail details otherwise it will be "null" already because i'm using ternary operators
      above where i'm checking if "uploadedThumbanil" variable will contain details of
      uploaded thumbnail then "uploadedeThumbnailDetails" variable will store details of it otherwise
      it will be "null"*/
    const createdVideo = await Video.create({
      title,
      description,
      normalizedStatus,
      video: uploadedVideoDetails,
      thumbnail: uploadedThumbnailDetails,
      owner: req.user._id,
      duration: uploadedVideo.duration,
    });

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
  // extract videoID
  // check - is videoId valid
  // find video with same vidoeId
  // populate owner details in found video's object
  // push videoId in current user's watchHistory
  // return response

  const { videoId } = req.params;

  checkObjectID(videoId, "Video id is invalid");

  const video = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              userName: 1,
              fullName: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        video: 1,
        views: 1,
        duration: 1,
        owner: 1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError(404, "Video doesn't exist");
  }

  const user = await User.findById(req.user._id);

  if (!user.watchHistory.includes(videoId)) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        watchHistory: {
          $each: [videoId],
          $position: 0,
          $slice: 20,
        },
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  // check all provided data of user must contain valid values
  // get video from provided videoId
  // save details in the video document
  // return response

  const { title, description } = req.body;

  checkFields([title, description], "Title and description are invalid", false);

  const { videoDoc } = req;

  if (title) {
    videoDoc.title = title;
  }

  if (description) {
    videoDoc.description = description;
  }

  const updatedVideo = await videoDoc.save();

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

    const { videoDoc } = req;

    // user's previous file
    const prevFile = videoDoc[fieldName];

    /*initialize this variable for storing resource-type or type for file to be uploaded.
    Because "uploadOnCloudinary()" method expects 2 arguments, file's to be uploaded
    local-path and type*/
    let resourceType = fieldName === "thumbnail" ? "image" : "video";

    const uploadedFile = await uploadOnCloudinary(req.file.path, resourceType);

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

    if (!updatedVideo) {
      throw new ApiError(
        500,
        "Internal server error while updating video after file uploading"
      );
    }

    // previous file deletion
    if (prevFile?.secureURL) {
      await deleteFromCloudinary(prevFile?.publicId, prevFile?.resourceType);
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
  // get video from videoId
  // if video exists, delete it
  // if video will be deleted successfully, delete video and thumbnail file from cloudinary too.
  // return response
  try {
    const { videoDoc } = req;

    const { video, thumbnail } = videoDoc;

    const deletedVideo = await videoDoc.deleteOne();

    if (deletedVideo.deletedCount === 0) {
      throw new ApiError(404, "Video doesn't exist");
    }

    await deleteFromCloudinary(video.publicId, video.resourceType);

    // check if thumbnail exists, and it's object must not be null then delete it
    if (thumbnail && Object.keys(thumbnail).length > 0) {
      await deleteFromCloudinary(thumbnail.publicId, thumbnail.resourceType);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video has been deleted successfully"));
  } catch (error) {
    throw error;
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // extract video status from req.body
  // Make 1st character of veideoSatus uppercase which user has provided
  // get the video
  /* check - if video has video-status same as provided, return response
  else update videoStatus and then return response*/

  try {
    const { videoStatus } = req.body;
    const { videoDoc } = req;

    checkFields([videoStatus], "Video status is required");

    const normalizedStatus =
      videoStatus.charAt(0).toUpperCase() + videoStatus.slice(1).toLowerCase(); // "public" → "Public"

    if (videoDoc.videoStatus === normalizedStatus) {
      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            {},
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
