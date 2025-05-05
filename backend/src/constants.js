// constant var for DB name
const DB_NAME = "youTube";
// max file size
const MAX_FILE_SIZE = 100 * 1024 * 1024;
// cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
};
// uploaded files allowed extensions
const IMAGE_EXTENTIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const VIDEO_EXTENTIONS = [".mp4", ".mov", ".avi", ".mkv"];
const ALLOWED_EXTENTIONS = [...IMAGE_EXTENTIONS, ...VIDEO_EXTENTIONS];

export {
  DB_NAME,
  MAX_FILE_SIZE,
  COOKIE_OPTIONS,
  IMAGE_EXTENTIONS,
  VIDEO_EXTENTIONS,
  ALLOWED_EXTENTIONS,
};
