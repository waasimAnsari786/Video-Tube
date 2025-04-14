import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideoAndThumbnail,
  updateVideoDetails,
} from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.use(verifyAuthorization);

videoRouter
  .route("/")
  .post(
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    validateFileType,
    publishAVideo
  )
  .get(getAllVideos);

videoRouter
  .route("/video/:videoId")
  .patch(upload.single("video"), validateFileType, updateVideoAndThumbnail);

videoRouter
  .route("/thumbnail/:videoId")
  .patch(upload.single("thumbnail"), validateFileType, updateVideoAndThumbnail);

videoRouter.route("/details/:videoId").patch(updateVideoDetails);

videoRouter.route("/:videoId").get(getVideoById).delete(deleteVideo);

export default videoRouter;
