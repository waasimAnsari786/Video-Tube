import { Router } from "express";
import { upload, validateFileType } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register-user").post(registerUser);

export { userRouter };
