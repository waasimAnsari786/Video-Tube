import { fileTypeFromFile } from "file-type";
import { ALLOWED_EXTENTIONS } from "../constants.js";
import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import path from "path";

// Middleware to Validate Real File Type
const validateFileType = asyncHandler(async (req, res, next) => {
  // check - does request contain req.file or req.files object
  // check - does req.file or req.files must not be null
  // if req.file object exists in request and it contains properties, push it into "files" array
  /*if req.files object exists in request and it contains properties, check - does it contain
  arrays? If yes, then extract the arrays and then update "files" array with the extracted
  arrays and apply "flat()" method for flatenning array.*/
  /* if req.files exists in request and it contains array of objects, update "files" array
  with ther exact req.files*/

  /* Note: This middleware is written for checking files which comes from wheather 
  upload.single(), upload.fields(), upload.arrays()*/

  /*after completing all of the above validations, i have a valid files array of objects
  for cheking the real file type of each file by looping over the "files" array */
  // check real file type of each file
  // check - is real file-type valid according to the allowed extentions?
  /* check - real file-type and file extention written in the original file name, match
  with each other?*/
  // if file is valid, set it's real file-type in file's object and then pass "next()" flag

  let files = [];

  try {
    if (!req.file && !req.files) {
      throw new ApiError(400, "No file uploaded");
    } else if (req.file) {
      if (Object.keys(req.file).length === 0) {
        throw new ApiError(400, "No file uploaded");
      } else {
        files.push(req.file);
      }
    } else if (req.files) {
      if (Object.keys(req.files).length === 0) {
        throw new ApiError(400, "No file uploaded");
        /* check - when files come from upload.fields, all are arrays or not? and then 
        update files array by storing just all file's objects*/
      } else if (Object.values(req.files).every(val => Array.isArray(val))) {
        files = Object.values(req.files).flat(); // ✅ Flatten array of arrays
      } else {
        //I have updated files array when files will come form upload.array() method
        files = req.files;
      }
    }

    for (const file of files) {
      const realFileType = await fileTypeFromFile(file.path);

      if (
        !realFileType ||
        !ALLOWED_EXTENTIONS.includes(`.${realFileType.ext.toLowerCase()}`)
      ) {
        throw new ApiError(
          400,
          `Invalid file type: "${realFileType.ext}" of file "${file.originalname}". Allowed: ${ALLOWED_EXTENTIONS.join(", ")}`
        );
      }

      if (
        `.${realFileType.ext.toLowerCase()}` !==
        path.extname(file.originalname).toLowerCase()
      ) {
        throw new ApiError(
          400,
          `Mismatch between actual file type "${realFileType.ext}" and file extension "${path.extname(file.originalname)}" of this file "${file.originalname}"`
        );
      }

      file.realFileType = realFileType.ext.toLowerCase();
    }
    next(); // Proceed if all files pass
  } catch (error) {
    for (const file of files) {
      deleteFileFromLocalServer(file.path);
    }
    throw error;
  }
});

export default validateFileType;
