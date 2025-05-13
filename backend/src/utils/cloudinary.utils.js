import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import ApiError from "./API_error.utils.js";
import deleteFileFromLocalServer from "./deleteFileFromLocalServer.utils.js";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath,
  type,
  transformationOptions = {}
) => {
  try {
    if (!localFilePath || !type) {
      console.error("File path, file resource type of file are required");
      throw new ApiError(500, "Internal server error while uploading file");
    }

    const uploadConfig = {
      resource_type: type,
      transformation: [transformationOptions],
    };

    const uploadedFile = await cloudinary.uploader.upload(
      localFilePath,
      uploadConfig
    );
    return uploadedFile;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    deleteFileFromLocalServer(localFilePath);
  }
};

const deleteFromCloudinary = async (publicIds = [], resourceType = "image") => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0 || !resourceType) {
      console.error("Missing public IDs or resource type for deletion");
      throw new ApiError(500, "Internal server error while deleting files");
    }

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
      invalidate: true,
    });

    // Check if all requested resources were deleted
    const deletionResults = result?.deleted || {};
    const allDeleted = publicIds.every(id => deletionResults[id] === "deleted");

    if (!allDeleted) {
      console.log("Failed to delete old media from Cloudinary");
    }
  } catch (error) {
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
