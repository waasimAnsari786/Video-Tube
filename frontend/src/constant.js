const REFRESH_INTERVAL = 14 * 60 * 1000;
const IMAGE_EXTENTIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const VIDEO_EXTENTIONS = [".mp4", ".mov", ".avi", ".mkv"];

// google related stuff
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export {
  REFRESH_INTERVAL,
  IMAGE_EXTENTIONS,
  VIDEO_EXTENTIONS,
  GOOGLE_CLIENT_ID,
};
