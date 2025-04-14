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
import videoOwnerCheck from "../middlewares/videoOwnerCheck.middleware.js";

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
  .patch(
    upload.single("video"),
    validateFileType,
    videoOwnerCheck,
    updateVideoAndThumbnail
  );

videoRouter
  .route("/thumbnail/:videoId")
  .patch(
    upload.single("thumbnail"),
    validateFileType,
    videoOwnerCheck,
    updateVideoAndThumbnail
  );

videoRouter
  .route("/details/:videoId")
  .patch(videoOwnerCheck, updateVideoDetails);

videoRouter
  .route("/:videoId")
  .get(getVideoById)
  .delete(videoOwnerCheck, deleteVideo);

export default videoRouter;
