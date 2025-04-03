import multer from "multer";
import path from "path";
import { ALLOWED_EXTENTIONS, MAX_FILE_SIZE } from "../constants.js";

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
    return cb(new multer.MulterError("File must have an extension."));
  }

  if (!ALLOWED_EXTENTIONS.includes(ext)) {
    return cb(
      new multer.MulterError(
        `Invalid file type: "${ext}" of file "${file.originalname}". Allowed: ${ALLOWED_EXTENTIONS.join(", ")}`
      )
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

export default upload;
