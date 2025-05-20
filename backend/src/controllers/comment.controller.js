import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import { IMAGE_EXTENTIONS } from "../constants.js";
import FileDetails from "../utils/fileObject.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import CloudinaryTransform from "../utils/fileTransformParams.utils.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";
import validateFileExtensions from "../utils/checkFileExtension.utils.js";
import { checkFields, checkObjectID } from "../utils/checkFields.utils.js";
import Comment from "../models/comment.model.js";
import { getModelByName } from "../utils/getModel.utils.js";

const createComment = asyncHandler(async (req, res) => {
  try {
    const { comment, status, targetId, parentComment, modelName } = req.body;

    // [2] Must have text or media
    if (
      (!comment || !comment.trim()) &&
      (!req.file || Object.keys(req.file).length === 0)
    ) {
      throw new ApiError(400, "Comment must have text or media content");
    }

    // [3] Check required fields
    checkFields(
      [status, targetId],
      "Comment status and target id are required"
    );

    // [4] Check valid status
    if (!["comment", "reply"].includes(status)) {
      throw new ApiError(400, "Invalid comment status");
    }

    // [5] Check valid ObjectId
    checkObjectID(targetId, "Comment target id is invalid");

    const TargetModel = getModelByName(modelName);
    if (!TargetModel) {
      throw new ApiError(400, "Invalid model type provided");
    }

    // [5.1] Check if target document exists using dynamic ref
    const targetDoc = await TargetModel.findById(targetId);
    if (!targetDoc) {
      throw new ApiError(404, "Target document not found");
    }

    // [6] If status is reply, check parent comment validity and existence
    if (status === "reply") {
      checkObjectID(parentComment, "Parent comment id is invalid");

      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        throw new ApiError(404, "Parent comment does not exist");
      }
    }

    // [7] Upload image if provided
    let uploadedImage = {};
    if (req.file && Object.keys(req.file).length > 0) {
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

    // [8] Create comment
    const createdComment = await Comment.create({
      owner: req.user._id,
      comment,
      commentImg: uploadedImage,
      status,
      parentComment,
      targetId,
      onModel: req.body.onModel, // required for refPath
    });

    // [9] Response
    return res
      .status(200)
      .json(
        new ApiResponse(200, createdComment, "Comment created successfully")
      );
  } catch (error) {
    // [10] Cleanup
    deleteFileFromLocalServer([req.file]);
    throw error;
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentDoc } = req; // available after ownership middleware

    const prevFile = commentDoc?.commentImg;

    const { comment } = req.body;

    if (
      (!comment || !comment.trim()) &&
      (!req.file || Object.keys(req.file).length === 0)
    ) {
      throw new ApiError(400, "Comment must have text or media content");
    }

    if (req.file && Object.keys(req.file).length > 0) {
      validateFileExtensions([req.file], IMAGE_EXTENTIONS);
      const imgTransformParams = new CloudinaryTransform(200, 200);
      const uploadedImg = await uploadOnCloudinary(
        req.file.path,
        "image",
        imgTransformParams
      );
      let uploadedImgDetails = new FileDetails(
        uploadedImg.secure_url,
        uploadedImg.resource_type,
        uploadedImg.public_id
      );
      commentDoc.commentImg = uploadedImgDetails;
    }

    if (comment) commentDoc.comment = comment;

    await commentDoc.save();

    prevFile?.secureURL &&
      (await deleteFromCloudinary([prevFile.publicId], prevFile.resourceType));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          commentDoc,
          "Comment has been updated successfully"
        )
      );
  } catch (error) {
    deleteFileFromLocalServer([req.file]);
    throw error;
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

export { createComment, deleteComment, updateComment };
