import Playlist from "../models/playlist.model.js";
import Video from "../models/video.model.js";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { checkFields } from "../utils/checkFields.utils.js";

const createPlaylist = asyncHandler(async (req, res) => {
  // [1] Extract necessary data from request
  // [2] Validate required fields
  // [3] Check if playlist with same name already exists for the user (optional but recommended)
  // [4] Create playlist in DB
  // [5] Return response
  // [6] If any error occurs, handle it

  try {
    const { name, description } = req.body;

    // [2] Validate required fields
    checkFields([name], "Playlist name is required");

    // [3] Optional: Check for duplicate playlist name for the same user
    const existingPlaylist = await Playlist.findOne({
      name: name.trim(),
      owner: req.user._id,
    });

    if (existingPlaylist) {
      throw new ApiError(409, "A playlist with this name already exists");
    }

    // [4] Create new playlist
    const newPlaylist = await Playlist.create({
      name: name,
      description: (description && description?.trim()) || "",
      owner: req.user._id,
    });

    // [5] Return response
    return res
      .status(201)
      .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
  } catch (error) {
    // [6] Error handling
    throw error;
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // [1] Extract videoId from request
  const { videoId } = req.params;

  // [2] Validate videoId
  checkObjectID(videoId, "Video ID is invalid");

  // [3] Check - does video exist?
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // [4] Extract "playlistDoc" from request (added by ownershipCheck middleware)
  const playlist = req.playlistDoc;

  // [5] Check if video already exists in the playlist
  const alreadyExists = playlist.videos.some(id => id.equals(videoId));
  if (alreadyExists) {
    throw new ApiError(409, "Video already exists in the playlist");
  }

  // [6] Add videoId to playlist.videos array
  playlist.videos.push(videoId);

  // [7] Save updated playlist
  await playlist.save();

  // [8] Return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // [1] Extract videoId from request
  const { videoId } = req.params;

  // [2] Check - is videoId a valid ObjectId?
  checkObjectID(videoId, "Video ID is invalid");

  // [3] Check - does video exist?
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // [4] Extract "playlistDoc" from request (populated by ownershipCheck middleware)
  const playlist = req.playlistDoc;

  // [5] Remove videoId from playlistDoc
  const videoIndex = playlist.videos.indexOf(videoId);
  if (videoIndex === -1) {
    throw new ApiError(400, "Video is not present in the playlist");
  }

  playlist.videos.splice(videoIndex, 1);
  await playlist.save();

  // [6] Return response
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // [1] Extract "playlistDoc" from request (populated by ownershipCheck middleware)
  const playlist = req.playlistDoc;

  // [2] Delete the playlist
  await playlist.deleteOne();

  // [3] Return response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  // [1] Extract name and description
  const { name, description } = req.body;

  // [2] Validate: at least one of name or description must be provided
  checkFields([name, description], "Name or desrciption must be valid", false);

  // [3] Extract "playlistDoc" from request (populated by ownershipCheck middleware)
  const playlist = req.playlistDoc;

  // [4] Update only the provided fields
  if (name && name.trim()) playlist.name = name.trim();
  if (description && description.trim())
    playlist.description = description.trim();

  await playlist.save();

  // [5] Return response
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
