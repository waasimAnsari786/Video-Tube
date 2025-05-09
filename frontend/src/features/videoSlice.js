import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import asyncThunkService from "../services/asyncThunkService";
import { initializeLoading, updateloadingAndError } from "../utils/thunkUtils";

const initialState = {
  loading: false,
  error: null,
  videosArr: [],
  video: {},
};

// Thunks
const uploadVideoThunk = createAsyncThunk(
  "video/uploadVideo",
  asyncThunkService.postThunk()
);

const updateVideoThunk = createAsyncThunk(
  "video/updateVideo",
  asyncThunkService.patchThunk()
);

const deleteVideoThunk = createAsyncThunk(
  "video/deleteVideo",
  asyncThunkService.deleteThunk()
);

const getVideoByIdThunk = createAsyncThunk(
  "video/getVideoById",
  asyncThunkService.getThunk()
);

const getAllVideosThunk = createAsyncThunk(
  "video/getAllVideos",
  asyncThunkService.getThunk()
);

// Slice
const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoById: (state, action) => {
      const id = action.payload;
      const foundVideo = state.videosArr.find((v) => v._id === id);
      if (foundVideo) {
        state.video = foundVideo;
      } else {
        state.video = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Video
      .addCase(uploadVideoThunk.pending, initializeLoading)
      .addCase(uploadVideoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.videosArr.shift(action.payload.data);
      })
      .addCase(uploadVideoThunk.rejected, updateloadingAndError)

      // Update Video
      .addCase(updateVideoThunk.pending, initializeLoading)
      .addCase(updateVideoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVideo = action.payload.data;
        state.videosArr = state.videosArr.map((video) =>
          video.id === updatedVideo.id ? updatedVideo : video
        );
      })
      .addCase(updateVideoThunk.rejected, updateloadingAndError)

      // Delete Video
      .addCase(deleteVideoThunk.pending, initializeLoading)
      .addCase(deleteVideoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.id;
        state.videosArr = state.videosArr.filter((v) => v.id !== deletedId);
      })
      .addCase(deleteVideoThunk.rejected, updateloadingAndError)

      // Get Video By ID
      .addCase(getVideoByIdThunk.pending, initializeLoading)
      .addCase(getVideoByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload.data;
      })
      .addCase(getVideoByIdThunk.rejected, updateloadingAndError)

      // Get All Videos
      .addCase(getAllVideosThunk.pending, initializeLoading)
      .addCase(getAllVideosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.videosArr = action.payload.data;
      })
      .addCase(getAllVideosThunk.rejected, updateloadingAndError);
  },
});

export {
  uploadVideoThunk,
  updateVideoThunk,
  deleteVideoThunk,
  getVideoByIdThunk,
  getAllVideosThunk,
};

export default videoSlice.reducer;
export const { setVideoById } = videoSlice.actions;
