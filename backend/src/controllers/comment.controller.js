import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import { IMAGE_EXTENTIONS, VIDEO_EXTENTIONS } from "../constants.js";
import FileDetails from "../utils/fileObject.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import CloudinaryTransform from "../utils/fileTransformParams.utils.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";
import validateFileExtensions from "../utils/checkFileExtension.utils.js";
import checkFields, { checkObjectID } from "../utils/checkFields.utils.js";
import Comment from "../models/comment.model.js";

const commentValidation = data => {
  const { comment, status, targetId, parentComment } = data;

  if (
    (!comment || !comment.trim()) &&
    (!req.file || Object.keys(req.file).length === 0)
  ) {
    throw new ApiError(400, "Comment must have text or media content");
  }

  checkFields([status, targetId], "Comment status and target id are required");

  if (!["comment", "reply"].includes(status)) {
    throw new ApiError(400, "Invalid comment status");
  }

  checkObjectID(targetId, "Comment target id is invalid");

  if (status === "reply") {
    checkFields([parentComment], "Parent comment id is required for replies");
    checkObjectID(parentComment, "Parent comment id is invalid");
  }
};

const createComment = asyncHandler(async (req, res) => {
  // [1] Extract necessary data from request
  // [2] Validate that the comment contains at least text or media file
  // [3] check - comment status and target are present?
  // [4] check - status has valid value?
  // [5] check- is target id valid objectID?
  // [6] check - has status field value "reply",is parentComment id present and valid ObjectId
  // [7] check - does req.file hold any file, upload it to cloudinary and then extract necessary data from response
  // [8] create comment in DB
  // [9] return response
  // [10] if any error occurs, delete all media files from local server
  try {
    const { comment, status, targetId, parentComment } = req.body;

    commentValidation({ comment, status, targetId, parentComment });

    let uploadedImage = {};

    if (Object.keys(req.file).length > 0) {
      validateFileExtensions([req.file], IMAGE_EXTENTIONS);
      const imgTransformParams = new CloudinaryTransform(200, 200);
      const uploaded = await uploadOnCloudinary(
        req.file.path,
        "image",
        imgTransformParams
      );
      uploadedImage = new FileDetails(
        uploaded.secure_url,
        uploaded.resource_type,
        uploaded.public_id
      );
    }

    // --- Save to DB ---
    const createdComment = await Comment.create({
      owner: req.user._id,
      comment,
      commentImg: uploadedImage,
      status,
      parentComment,
      targetId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, createdComment, "Comment created successfully")
      );
  } catch (error) {
    deleteFileFromLocalServer([req.file]);
    throw error;
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentDoc } = req; // available after ownership middleware

  const { comment, status, targetId, parentComment } = req.body;

  commentValidation({ comment, status, targetId, parentComment });

  if (status !== commentDoc.status) {
    throw new ApiError(400, "You can not change or upadate the comment status");
  }

  if (targetId !== commentDoc.targetId) {
    throw new ApiError(
      400,
      "You can not change or upadate the comment targetId"
    );
  }

  if (status === "reply" && parentComment !== commentDoc.parentComment) {
    throw new ApiError(400, "You can not change or upadate the parent comment");
  }

  commentDoc.comment = comment;
  await commentDoc.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, commentDoc, "Comment has been updated successfully")
    );
});

const updateTweetMedia = asyncHandler(async (req, res) => {
  try {
    const { tweetDoc } = req;

    if (!req.files && req.files.length === 0) {
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
    deleteFileFromLocalServer(req.files);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentDoc } = req;

    const image = commentDoc.commentImg;

    // Delete the comment from DB first
    const deletedComment = await commentDoc.deleteOne();

    if (deletedComment.deletedCount === 0) {
      throw new ApiError(404, "Comment doesn't exist");
    }

    // Delete all images in one request
    if (image?.secureURL) {
      await deleteFromCloudinary([image.publicId], image.resourceType);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment has been deleted successfully"));
  } catch (error) {
    throw error;
  }
});

export {
  createComment,
  getTweets,
  updateTweetTextContent,
  deleteComment,
  updateTweetMedia,
};
