import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  deleteAvatarAndCoverImage,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatarAndCoverImage,
  updatePassword,
} from "../controllers/user.controller.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";

const userRouter = Router();

userRouter.route("/register-user").post(registerUser);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/logout-user").post(verifyAuthorization, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/update-password").patch(verifyAuthorization, updatePassword);
userRouter
  .route("/update-account-details")
  .patch(verifyAuthorization, updateAccountDetails);
userRouter
  .route("/update-avatar")
  .patch(
    verifyAuthorization,
    upload.single("avatar"),
    validateFileType,
    updateAvatarAndCoverImage
  );
userRouter
  .route("/update-cover-image")
  .patch(
    verifyAuthorization,
    upload.single("coverImage"),
    validateFileType,
    updateAvatarAndCoverImage
  );
userRouter
  .route("/delete-avatar-cover-image")
  .delete(verifyAuthorization, deleteAvatarAndCoverImage);

export { userRouter };
