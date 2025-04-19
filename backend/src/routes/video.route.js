import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideoAndThumbnail,
  updateVideoDetails,
} from "../controllers/video.controller.js";
import videoOwnerCheck from "../middlewares/videoOwnerCheck.middleware.js";

const videoRouter = Router();

// Global auth check
videoRouter.use(verifyAuthorization);

// Routes that don't need videoOwnerCheck
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

// Apply videoOwnerCheck only on routes that have :videoId param
videoRouter.use(
  ["/video/:videoId", "/thumbnail/:videoId", "/details/:videoId"],
  videoOwnerCheck
);

// Routes that need ownership validation
videoRouter
  .route("/video/:videoId")
  .patch(upload.single("video"), validateFileType, updateVideoAndThumbnail);

videoRouter
  .route("/thumbnail/:videoId")
  .patch(upload.single("thumbnail"), validateFileType, updateVideoAndThumbnail);

videoRouter.route("/details/:videoId").patch(updateVideoDetails);

videoRouter
  .route("/:videoId")
  .get(getVideoById)
  .delete(videoOwnerCheck, deleteVideo)
  .patch(videoOwnerCheck, togglePublishStatus);

export default videoRouter;
