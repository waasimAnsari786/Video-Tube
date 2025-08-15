import { OAuth2Client } from "google-auth-library";
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

//-----****user excluded properties/fields****-----
// google users excluded fields
const USER_EXCLUDED_FIELDS =
  "-avatar.publicId -avatar.resourceType -coverImage.publicId -coverImage.resourceType -password -emailVerificationOtp -emailVerificationOtpExpires";

//-----****user fields validation regex****-----
// validate userName regex
const VALIDATE_USERNAME_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*_.*_)[a-zA-Z0-9_]{3,20}$/;
// validate email regex
const VALIDATE_EMAIL_REGEX =
  /^[\da-zA-Z]+(?:[+%._-][\da-zA-Z]+)*@(?:[-.])*[a-zA-Z\d]+(?:[-])*\.[A-Za-z]{2,}$/;
// validate PASSWORD regex
const VALIDATE_PASSWORD_REGEX =
  /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

// google related stuff constants
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT = new OAuth2Client(GOOGLE_CLIENT_ID);

export {
  DB_NAME,
  MAX_FILE_SIZE,
  COOKIE_OPTIONS,
  IMAGE_EXTENTIONS,
  VIDEO_EXTENTIONS,
  ALLOWED_EXTENTIONS,
  USER_EXCLUDED_FIELDS,
  GOOGLE_CLIENT,
  GOOGLE_CLIENT_ID,
  VALIDATE_EMAIL_REGEX,
  VALIDATE_PASSWORD_REGEX,
  VALIDATE_USERNAME_REGEX,
};
