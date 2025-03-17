import { Router } from "express";
import { upload, validateFileType } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter
  .route("/upload")
  .post(upload.single("avatar"), validateFileType, registerUser);

userRouter.route("/upload2").post(
  upload.fields([
    { name: "avatar2", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateFileType,
  registerUser
);
userRouter
  .route("/upload3")
  .post(upload.array("gallery", 3), validateFileType, registerUser);

export { userRouter };
