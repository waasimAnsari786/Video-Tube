import { Router } from "express";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import ownershipCheck from "../middlewares/ownershipCheck.middleware.js";
import Playlist from "../models/playlist.model.js";

import {
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getSinglePlaylist,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

// 🔐 Apply authorization globally
playlistRouter.use(verifyAuthorization);

// 🔄 Routes that don’t need ownership check
playlistRouter.route("/").post(createPlaylist).get(getAllPlaylists);

playlistRouter.route("/:playlistId").get(getSinglePlaylist);

// 🛡️ Ownership check for routes that need protection
playlistRouter.use(
  ["/:playlistId", "/add/:playlistId/:videoId", "/remove/:playlistId/:videoId"],
  ownershipCheck(Playlist, "playlistId", "playlistDoc", "Playlist not found")
);

// ➕ Add video to playlist
playlistRouter.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);

// ➖ Remove video from playlist
playlistRouter
  .route("/remove/:playlistId/:videoId")
  .patch(removeVideoFromPlaylist);

// 📝 Update playlist (name or description)
playlistRouter.route("/:playlistId").patch(updatePlaylist);

// ❌ Delete playlist
playlistRouter.route("/:playlistId").delete(deletePlaylist);

export default playlistRouter;
