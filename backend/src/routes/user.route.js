import { Router } from "express";
import { upload, validateFileType } from "../middlewares/multer.middleware.js";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updatePassword,
} from "../controllers/user.controller.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";

const userRouter = Router();

userRouter.route("/register-user").post(registerUser);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/logout-user").post(verifyAuthorization, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/update-password").patch(verifyAuthorization, updatePassword);
userRouter
  .route("/update-account-details")
  .patch(verifyAuthorization, updateAccountDetails);

export { userRouter };
