import { Router } from "express";
import { upload, validateFileType } from "../middlewares/multer.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import verifyAuthorizaion from "../middlewares/verifyAuthorizaion.middleware.js";

const userRouter = Router();

userRouter.route("/register-user").post(registerUser);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/logout-user").post(verifyAuthorizaion, logoutUser);

export { userRouter };
