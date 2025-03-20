import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./API_error.utils.js";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "File path is missing");
    }
    // Upload the file
    const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
      public_id: "shoes",
    });

    return { url: uploadedFile.secure_url, public_id: uploadedFile.public_id }; // ✅ Return the upload result to the caller
  } catch (error) {
    throw new ApiError(
      500,
      `Cloudinary file upload error: ${error.message}` ||
        "Error while uploading file on cloudinary"
    );
  } finally {
    // Delete the local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

export default uploadOnCloudinary;
