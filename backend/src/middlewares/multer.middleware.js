import multer from "multer";
import path from "path";
import { fileTypeFromFile } from "file-type";
import { MAX_FILE_SIZE } from "../constants.js";
import ApiError from "../utils/API_error.utils.js";

// Allowed extensions
const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
];

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

// File Filter Function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ext) {
    return cb(new Error("File must have an extension."), false);
  }

  if (!allowedExtensions.includes(ext)) {
    return cb(
      new Error(
        `Invalid file type: "${ext}" of file ${file.originalname}. Allowed: ${allowedExtensions.join(", ")}`
      ),
      false
    );
  }

  cb(null, true);
};

// Multer Middleware
const upload = multer({
  storage,
  // CONSTANT VARIABLE FROM CONSTANTS.JS
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Middleware to Validate Real File Type
const validateFileType = async (req, res, next) => {
  // initialize empty array for storing files
  let files = [];
  if (!req.file && !req.files) {
    //have throwed error if no file will be uploaded
    return res.status(400).json({ error: "No file uploaded" });
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

  try {
    // looped on files array for detecting the real file type of files to be uploaded
    for (const file of files) {
      // extract real file-type
      const realFileType = await fileTypeFromFile(file.path);
      // Check if file is not matched with claimed extension or file-type is not whitelisted in allowed extenions
      if (
        !realFileType ||
        !allowedExtensions.includes(`.${realFileType.ext.toLowerCase()}`)
      ) {
        // throw error if invalid file will detect
        throw new ApiError(
          400,
          "File type mismatch. Possible tampering detected."
        );
      }
    }
    next(); // Proceed if all files pass
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { upload, validateFileType };
