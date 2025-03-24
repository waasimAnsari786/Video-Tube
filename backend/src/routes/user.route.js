import { Router } from "express";
import { upload, validateFileType } from "../middlewares/multer.middleware.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register-user").post(registerUser);
userRouter.route("/login-user").post(loginUser);

export { userRouter };
