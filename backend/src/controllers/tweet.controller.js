import pLimit from "p-limit";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import { IMAGE_EXTENTIONS, VIDEO_EXTENTIONS } from "../constants.js";
import FileDetails from "../utils/fileObject.utils.js";
import Tweet from "../models/tweet.model.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import CloudinaryTransform from "../utils/fileTransformParams.utils.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";
import validateFileExtensions from "../utils/checkFileExtension.utils.js";
import { checkFields } from "../utils/checkFields.utils.js";

const limit = pLimit(2); // Limit concurrency to 10

const createTweet = asyncHandler(async (req, res) => {
  // [1] Extract text content and media files from request
  // [2] Validate that the tweet contains at least text or one media file
  // [3] Validate extensions for all images and videos
  // [4] Upload all images to Cloudinary in parallel with concurrency limit
  // [5] Upload all videos to Cloudinary in parallel with concurrency limit
  // [6] Save uploaded media and text content to the database
  // [7] Return success response
  // [8] Handle errors and cleanup local files
  try {
    const { textContent } = req.body;

    // Optional: validate textContent
    if (
      (!textContent || !textContent.trim()) &&
      (!req.files || Object.keys(req.files).length === 0)
    ) {
      throw new ApiError(400, "Tweet must have text or media content");
    }

    const { tweetImg = [], tweetVideo = [] } = req.files;

    let uploadedImages = null;
    let uploadedVideos = null;

    if (tweetImg.length > 0) {
      validateFileExtensions(tweetImg, IMAGE_EXTENTIONS);
      const imgTransformParams = new CloudinaryTransform(600, 600);
      uploadedImages = await Promise.all(
        tweetImg.map(file =>
          limit(async () => {
            const uploaded = await uploadOnCloudinary(
              file.path,
              "image",
              imgTransformParams
            );
            return new FileDetails(
              uploaded.secure_url,
              uploaded.resource_type,
              uploaded.public_id
            );
          })
        )
      );
    }

    if (tweetVideo.length > 0) {
      validateFileExtensions(tweetVideo, VIDEO_EXTENTIONS);
      uploadedVideos = await Promise.all(
        tweetVideo.map(file =>
          limit(async () => {
            const uploaded = await uploadOnCloudinary(file.path, "video");
            return new FileDetails(
              uploaded.secure_url,
              uploaded.resource_type,
              uploaded.public_id
            );
          })
        )
      );
    }

    let validTextContent = null;
    if (textContent && typeof textContent === "string" && textContent.trim()) {
      validTextContent = textContent;
    }

    // --- Save to DB ---
    const tweet = await Tweet.create({
      owner: req.user._id,
      textContent: validTextContent,
      tweetImg: uploadedImages,
      tweetVideo: uploadedVideos,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));
  } catch (error) {
    // Cleanup: delete all uploaded files from local server
    deleteFileFromLocalServer(Object.values(req.files || {}).flat());
    throw error;
  }
});

const getTweets = asyncHandler(async (req, res) => {
  // Fetch all tweets
  const tweets = await Tweet.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $addFields: {
        avatarURL: "$owner.avatar.secureURL",
      },
    },
    {
      $project: {
        textContent: 1,
        tweetImg: 1,
        tweetVideo: 1,
        avatarURL: 1,
        userName: 1,
        fullName: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweetTextContent = asyncHandler(async (req, res) => {
  const { tweetDoc } = req; // available after ownership middleware
  const { textContent } = req.body;

  checkFields([textContent], "Text content cannot be empty");

  tweetDoc.textContent = textContent;
  await tweetDoc.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweetDoc, "Tweet text content updated successfully")
    );
});

const updateTweetMedia = asyncHandler(async (req, res) => {
  try {
    const { tweetDoc } = req;

    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, "No file uploaded");
    }

    const files = req.files; // will always be an array in upload.array()

    const fieldName = files[0].fieldname;
    const prevFiles = tweetDoc[fieldName];

    const allowedExtensions =
      fieldName === "tweetImg" ? IMAGE_EXTENTIONS : VIDEO_EXTENTIONS;

    const resourceType = fieldName === "tweetImg" ? "image" : "video";

    validateFileExtensions(files, allowedExtensions);

    const uploadedMedia = await Promise.all(
      files.map(file =>
        limit(async () => {
          const transformation =
            fieldName === "tweetImg" ? new CloudinaryTransform(600, 600) : {};
          const uploaded = await uploadOnCloudinary(
            file.path,
            resourceType,
            transformation
          );
          return new FileDetails(
            uploaded.secure_url,
            uploaded.resource_type,
            uploaded.public_id
          );
        })
      )
    );

    tweetDoc[fieldName] = uploadedMedia;
    await tweetDoc.save();

    const oldMediaPublicIds = prevFiles?.map(file => file.publicId) || [];

    oldMediaPublicIds.length > 0 &&
      (await deleteFromCloudinary(oldMediaPublicIds, resourceType));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          tweetDoc,
          `Tweet ${resourceType}s updated successfully`
        )
      );
  } catch (error) {
    deleteFileFromLocalServer(req.files || []);
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetDoc } = req;

    // Extract images and videos
    const images = tweetDoc.tweetImg || [];
    const videos = tweetDoc.tweetVideo || [];

    // Delete the tweet from DB first
    const deletedTweet = await tweetDoc.deleteOne();

    if (deletedTweet.deletedCount === 0) {
      throw new ApiError(404, "Tweet doesn't exist");
    }

    // Delete all images in one request
    if (images.length > 0) {
      const imagePublicIds = images.map(img => img.publicId);
      await deleteFromCloudinary(imagePublicIds, "image");
    }
    // Delete all videos in one request
    if (videos.length > 0) {
      const videoPublicIds = videos.map(video => video.publicId);
      await deleteFromCloudinary(videoPublicIds, "video");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet has been deleted successfully"));
  } catch (error) {
    throw error;
  }
});

export {
  createTweet,
  getTweets,
  updateTweetTextContent,
  deleteTweet,
  updateTweetMedia,
};
