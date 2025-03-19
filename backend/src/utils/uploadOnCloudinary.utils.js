import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async localFilePath => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Upload the file
    const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
      public_id: "shoes",
    });

    // Delete the local file after upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return { url: uploadedFile.secure_url, public_id: uploadedFile.public_id }; // ✅ Return the upload result to the caller
  } catch (error) {
    console.error("Upload error:", error.message);
    return null; // Return null in case of an error
  }
};

export default uploadOnCloudinary;
