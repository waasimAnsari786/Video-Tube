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

const uploadOnCloudinary = async (localFilePath, type) => {
  // check that is "locaFilePath" present? if doesn't, throw error
  // upload file on cloudinary
  // throw errors from cath block
  // write localFilePath's file on local server delete logic in finally block
  // return uploaded result
  try {
    if (!localFilePath || !type) {
      throw new ApiError(
        500,
        "Internal server error: File path or file resource type is missing"
      );
    }
    // Upload the file
    const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
      resource_type: type,
    });
    return uploadedFile; // ✅ Return the upload result to the caller
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error.statusCode || 500,
      "Internal server error while uploading file on cloudinary"
    );
  } finally {
    // utility function for deleting files from local server
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
      throw new ApiError(
        500,
        "Internal server error: File's public id or resource type is missing"
      );
    }
    const fileDetails = await cloudinary.api.resource(publicId);
    if (fileDetails.resource_type !== type) {
      console.error("Provided resource-type of file is incorrect");
      throw new ApiError(
        500,
        "Internal server error while deleting files from cloudinary"
      );
    }
    const deletedResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
      invalidate: true,
    });

    return deletedResult.result === "ok" ? true : false;
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      `Cloudinary file delete error: ${error.message}` ||
        "Internal server error while deleting file from cloudinary"
    );
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
