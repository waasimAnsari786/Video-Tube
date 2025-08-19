import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAccountDetails,
  updateAvatarAndCoverImage,
  deleteAvatarAndCoverImage,
  getUserChannelDetails,
  getWatchHistory,
  getCurrentUser,
  googleSignup,
  sendEmailVerification,
  verifyEmailByLink,
  verifyEmailByOTP,
  updatePasswordViaOldPassword,
  sendUpdatePasswordOTP,
  verifyUpdatePasswordOTP,
  updatePasswordViaOTP,
  googleCallback,
} from "../controllers/user.controller.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import checkUserEmailStatus from "../middlewares/checkUserEmailStatus.middleware.js";
import passport from "passport";

const userRouter = Router();

// --- Public Routes ---
userRouter.route("/").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter
  .route("/verify-email")
  .post(checkUserEmailStatus, sendEmailVerification); // Send link or OTP based on req.body

userRouter
  .route("/verify-email/link")
  .post(checkUserEmailStatus, verifyEmailByLink); // Handle verification via link

userRouter
  .route("/verify-email/otp")
  .post(checkUserEmailStatus, verifyEmailByOTP); // Handle verification via OTP

// Start Google login
userRouter
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

/** -------Session-based google callback route------*/
// userRouter.route("/google/callback").get(
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:5173",
//     successRedirect: "http://localhost:5173",
//   })
// );

/** -------JWT-based google callback route------*/
userRouter.route("/google/callback").get(
  passport.authenticate(
    "google",
    {
      failureRedirect: "http://localhost:5173",
      session: false,
    },
    googleCallback
  )
);

// --- Authenticated Routes ---
userRouter.use(verifyAuthorization); // Protect everything below

userRouter.route("/me/logout").post(logoutUser);
userRouter.route("/me/password").patch(updatePasswordViaOldPassword);
userRouter.route("/me/password/forget").post(sendUpdatePasswordOTP);
userRouter.route("/me/password/otp").post(verifyUpdatePasswordOTP);
userRouter.route("/me/password/reset").patch(updatePasswordViaOTP);
userRouter.route("/me").patch(updateAccountDetails).get(getCurrentUser);
userRouter.route("/channel/:userName").get(getUserChannelDetails);
userRouter.route("/history").get(getWatchHistory);

userRouter
  .route("/me/avatar")
  .patch(upload.single("avatar"), validateFileType, updateAvatarAndCoverImage)
  .delete(deleteAvatarAndCoverImage);
userRouter
  .route("/me/cover")
  .patch(
    upload.single("coverImage"),
    validateFileType,
    updateAvatarAndCoverImage
  )
  .delete(deleteAvatarAndCoverImage);

export default userRouter;
