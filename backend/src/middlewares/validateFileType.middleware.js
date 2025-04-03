import { fileTypeFromFile } from "file-type";
import { ALLOWED_EXTENTIONS } from "../constants.js";
import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";

// Middleware to Validate Real File Type
const validateFileType = asyncHandler(async (req, res, next) => {
  // initialize empty array for storing files
  let files = [];
  if (!req.file && !req.files) {
    //have throwed error if no file will be uploaded
    throw new ApiError(400, "No file uploaded");
  } else if (req.files && Object.keys(req.files).length === 0) {
    // throwed error if req.files exists with empty object
    throw new ApiError(400, "No file uploaded");
  } else if (req.file) {
    // have pushed files into files array when files will come from upload.single() method
    files.push(req.file);
  } else if (req.files) {
    // have filtered all the files's object only instead off parent or child array or objects in upload.fields() method
    if (Object.values(req.files).every(val => Array.isArray(val))) {
      files = Object.values(req.files).flat(); // ✅ Flatten array of arrays
    } else {
      // have updated files array when files will come form upload.array() method
      files = req.files;
    }
  }

  // looped on files array for detecting the real file type of files to be uploaded
  for (const file of files) {
    // extract real file-type
    const realFileType = await fileTypeFromFile(file.path);
    // Check if file is not matched with claimed extension or file-type is not whitelisted in allowed extenions
    if (
      !realFileType ||
      !ALLOWED_EXTENTIONS.includes(`.${realFileType.ext.toLowerCase()}`)
    ) {
      // looping over files for deleteing all files from local server if any error occurs
      for (const file of files) {
        // utility function for deleting files from local server
        deleteFileFromLocalServer(file.path);
      }
      // throw error if invalid file will detect
      throw new ApiError(
        400,
        "File type mismatch. Possible tampering detected."
      );
    }
    // set real file type in req.files for applying validations in controllers
    file.realFileType = realFileType.ext.toLowerCase();
  }
  next(); // Proceed if all files pass
});

export default validateFileType;
