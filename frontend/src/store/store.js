// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import videoReducer from "./slices/videoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
  },
});
