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

// Apply auth check to all routes
videoRouter.use(verifyAuthorization);

/* 
|--------------------------------------------------------------------------
| Routes that require only Authorization (not ownership)
|--------------------------------------------------------------------------
*/
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

/* 
|--------------------------------------------------------------------------
| Routes that require both Authorization + Video Ownership
|--------------------------------------------------------------------------
*/
videoRouter.use(videoOwnerCheck);

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
  .delete(deleteVideo)
  .patch(togglePublishStatus);

export default videoRouter;
