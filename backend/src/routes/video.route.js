import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.use(verifyAuthorization);

videoRouter.route("/").post(
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateFileType,
  publishAVideo
);

export { videoRouter };
