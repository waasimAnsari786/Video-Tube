import pLimit from "p-limit";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import {
  IMAGE_EXTENTIONS,
  VIDEO_EXTENTIONS,
} from "../constants/fileExtensions.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.utils.js";
import FileDetails from "../utils/FileDetails.utils.js";
import Tweet from "../models/tweet.model.js";
import { deleteFileFromLocalServer } from "../utils/deleteLocalFile.utils.js";
import CloudinaryTransform from "../utils/fileTransformParams.utils.js";

const limit = pLimit(2); // Limit concurrency to 10

const validateFileExtensions = (
  filesArray = [],
  validExtensions = [],
  fieldType = "file"
) => {
  for (const file of filesArray) {
    const ext = `.${file.realFileType}`;
    if (!validExtensions.includes(ext)) {
      throw new ApiError(
        400,
        `"${file.originalname}" is not a valid ${fieldType} file.`
      );
    }
  }
};

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
    const { tweetImg = [], tweetVideo = [] } = req.files;

    // Optional: validate textContent
    if (!textContent && tweetImg.length === 0 && tweetVideo.length === 0) {
      throw new ApiError(400, "Tweet must have text or media content");
    }

    validateFileExtensions(tweetImg, IMAGE_EXTENTIONS, "image");
    validateFileExtensions(tweetVideo, VIDEO_EXTENTIONS, "video");

    let imgTransformParams = new CloudinaryTransform(600, 600);

    const uploadedImages = await Promise.all(
      validImages.map(file =>
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

    const uploadedVideos = await Promise.all(
      validVideos.map(file =>
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

    // --- Save to DB ---
    const tweet = await Tweet.create({
      owner: req.user._id,
      textContent,
      tweetImg: uploadedImages,
      tweetVideo: uploadedVideos,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully"));
  } catch (error) {
    // Cleanup: delete all uploaded files from local server
    Object.values(req.files)
      .flat()
      .forEach(file => {
        deleteFileFromLocalServer(file.path);
      });
    throw error;
  }
});

const getTweets = asyncHandler(async (req, res) => {
  // Fetch all tweets
  const tweets = await Tweet.find({}).sort({ createdAt: -1 }).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweetTextContent = asyncHandler(async (req, res) => {
  const { tweetDoc } = req; // available after ownership middleware
  const { textContent } = req.body;

  if (!textContent?.trim()) {
    throw new ApiError(400, "Text content cannot be empty");
  }

  tweetDoc.textContent = textContent;
  await tweetDoc.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweetDoc, "Tweet text content updated successfully")
    );
});

const updateTweetMedia = asyncHandler(async (req, res) => {
  const { tweetDoc } = req;

  const files = req.files; // will always be an array in upload.array()
  if (!files || files.length === 0) {
    throw new ApiError(400, "No media files provided");
  }

  const fieldName = files[0].fieldname;
  const filesToBeUpdate = tweetDoc[fieldName];

  if (!filesToBeUpdate) {
    throw new ApiError(
      404,
      `Tweet has not any file with this fieldname "${fieldName}"`
    );
  }

  const allowedExtensions = isImage ? IMAGE_EXTENTIONS : VIDEO_EXTENTIONS;
  const resourceType = isImage ? "image" : "video";

  validateFileExtensions(files, allowedExtensions, resourceType);

  const oldMediaPublicIds =
    tweetDoc[fieldName]?.map(item => item.publicId) || [];

  const allDeleted = await deleteFromCloudinary(
    oldMediaPublicIds,
    resourceType
  );
  if (!allDeleted) {
    throw new ApiError(500, "Failed to delete old media from Cloudinary");
  }

  const uploadedMedia = await Promise.all(
    files.map(file =>
      limit(async () => {
        const transformation = isImage ? new CloudinaryTransform(600, 600) : {};
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tweetDoc,
        `Tweet ${resourceType}s updated successfully`
      )
    );
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
      const videoPublicIds = images.map(video => video.publicId);
      await deleteFromCloudinary(videoPublicIds, "video");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet has been deleted successfully"));
  } catch (error) {
    throw error;
  }
});

export { createTweet, getTweets, updateTweetTextContent, deleteTweet };
