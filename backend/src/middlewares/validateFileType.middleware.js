import { fileTypeFromFile } from "file-type";
import { ALLOWED_EXTENTIONS } from "../constants.js";
import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import path from "path";

// Middleware to Validate Real File Type
const validateFileType = asyncHandler(async (req, res, next) => {
  // Middleware to validate the actual file type of uploaded files using "file-type" package
  // ✅ Handles files coming from: upload.single(), upload.array(), and upload.fields()
  /*
- Handled file extraction from all multer upload methods:
  • If req.file exists and is non-empty, pushed to files array (upload.single()).
  • If req.files is an object with array values, flattened it (upload.fields()).
  • Otherwise, treated req.files as a direct array (upload.array()).
- Ensured the final `files` array always contains valid file objects for validation.
- Used file-type package to detect actual file type of each uploaded file.
- Compared detected file type with:
  • File extension written in original filename to catch mismatches.
- Attached the real file type as `file.realFileType` to each valid file object.
- If validation failed, deleted all uploaded files using helper function.
- Called next()
*/

  let files = [];

  try {
    if (req.file && Object.keys(req.file).length > 0) {
      files.push(req.file);
    } else if (req.files && Object.keys(req.files).length > 0) {
      // this check is for are the files comming from upload.fields()
      if (Object.values(req.files).every(val => Array.isArray(val))) {
        files = Object.values(req.files).flat(); // ✅ Flatten array of arrays
      } else {
        files = req.files;
      }
    }

    if (files.length > 0) {
      for (const file of files) {
        const realFileType = await fileTypeFromFile(file.path);
        if (!realFileType || !realFileType?.ext) {
          throw new ApiError(400, `Invalid file: ${file.originalname} `);
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
    }
    next();
  } catch (error) {
    deleteFileFromLocalServer(files);
    throw error;
  }
});

export default validateFileType;
