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
    if (
      !localFilePath ||
      !type ||
      Object.keys(transformationOptions).length === 0
    ) {
      console.error(
        "File path, file resource type and tranformation options of file are required"
      );
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

const deleteFromCloudinary = async (publicId, type) => {
  // check, is publicIDs or file's resource-type present? If doesn't, throw error
  // get each file details which publicID is provided in "publicIDs" param
  // match provided resource type in "type" param with geted file's resource type of cloudinary
  // if they don't match throw error else delete files from cloudinary
  // return deleted result

  try {
    // "type" contains requested file's resourceType
    if (!publicId || !type) {
      console.error("File's public id or resource type is missing");
      throw new ApiError(500, "Internal server error while deleting file");
    }

    const fileDetails = await cloudinary.api.resource(publicId, {
      resource_type: type,
    });

    if (fileDetails.resource_type !== type) {
      console.error("Provided resource-type of file is incorrect");
      throw new ApiError(500, "Internal server error while deleting file");
    }

    const deletedResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
      invalidate: true,
    });

    return deletedResult.result === "ok" ? true : false;
  } catch (error) {
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
