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
  // check - filename has entention?
  // check - is extention vlaid?
  // check is filename valid?
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ext) {
    return cb(new multer.MulterError("File must have an extention."));
  }

  if (!ALLOWED_EXTENTIONS.includes(ext)) {
    return cb(
      new multer.MulterError(
        `Invalid file type: "${ext}" of file "${file.originalname}". Allowed: ${ALLOWED_EXTENTIONS.join(", ")}`
      )
    );
  }

  const safeFileNameRegex = /^[a-zA-Z0-9._-]+$/;

  const isSafeFileName = filename => safeFileNameRegex.test(filename);

  if (!isSafeFileName(file.originalname)) {
    return cb(
      new multer.MulterError(
        `Unsafe filename: "${file.originalname}". Only alphanumeric, ".", "_", "-" allowed.`
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
