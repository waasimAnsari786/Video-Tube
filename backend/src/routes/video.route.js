import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import {
  deleteThumbnail,
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideoAndThumbnail,
  updateVideoDetails,
} from "../controllers/video.controller.js";
import ownershipCheck from "../middlewares/ownershipCheck.middleware.js";
import Video from "../models/video.model.js";

const videoRouter = Router();

// Global auth check
videoRouter.use(verifyAuthorization);

// Routes that don't need ownershipCheck
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

// Apply ownershipCheck only on routes that have :videoId param
videoRouter.use(
  ["/video/:videoId", "/thumbnail/:videoId", "/details/:videoId", "/:videoId"],
  ownershipCheck(Video, "videoId", "videoDoc", "Video not found")
);

// Routes that need ownership validation
videoRouter
  .route("/video/:videoId")
  .patch(upload.single("video"), validateFileType, updateVideoAndThumbnail);

videoRouter
  .route("/thumbnail/:videoId")
  .patch(upload.single("thumbnail"), validateFileType, updateVideoAndThumbnail)
  .delete(deleteThumbnail);

videoRouter.route("/details/:videoId").patch(updateVideoDetails);

videoRouter.route("/:videoId").delete(deleteVideo).patch(togglePublishStatus);

videoRouter.route("/v/:videoId").get(getVideoById);

export default videoRouter;
