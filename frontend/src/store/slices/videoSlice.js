import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  asyncThunkService,
  updateStateOnPending,
  updateStateOnRejected,
} from "../../index";

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
    getVideo: (state, action) => {
      const id = action.payload;
      const foundVideo = state.videosArr.find((v) => v._id === id);
      state.video = foundVideo ? foundVideo : {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Video
      .addCase(uploadVideoThunk.pending, updateStateOnPending)
      .addCase(uploadVideoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.videosArr.shift(action.payload.data);
      })
      .addCase(uploadVideoThunk.rejected, updateStateOnRejected)

      // Update Video
      .addCase(updateVideoThunk.pending, updateStateOnPending)
      .addCase(updateVideoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVideo = action.payload.data;
        state.videosArr = state.videosArr.map((video) =>
          video.id === updatedVideo.id ? updatedVideo : video
        );
      })
      .addCase(updateVideoThunk.rejected, updateStateOnRejected)

      // Delete Video
      .addCase(deleteVideoThunk.pending, updateStateOnPending)
      .addCase(deleteVideoThunk.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.id;
        state.videosArr = state.videosArr.filter((v) => v.id !== deletedId);
      })
      .addCase(deleteVideoThunk.rejected, updateStateOnRejected)

      // Get Video By ID
      .addCase(getVideoByIdThunk.pending, updateStateOnPending)
      .addCase(getVideoByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload.data;
      })
      .addCase(getVideoByIdThunk.rejected, updateStateOnRejected)

      // Get All Videos
      .addCase(getAllVideosThunk.pending, updateStateOnPending)
      .addCase(getAllVideosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.videosArr = action.payload.data;
      })
      .addCase(getAllVideosThunk.rejected, updateStateOnRejected);
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
export const { getVideo } = videoSlice.actions;
