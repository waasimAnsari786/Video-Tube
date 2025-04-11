import { Schema, model } from "mongoose";

// Create mini-schema for video and thumbnail
const mediaSchema = new Schema(
  {
    secureURL: { type: String, required: true },
    resourceType: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false } // Prevents MongoDB from generating _id for each media object
);

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    video: {
      type: mediaSchema,
      required: true, // Now this will be validated properly
    },
    thumbnail: {
      type: mediaSchema,
      required: false, // Optional
    },
    videoStatus: {
      type: String,
      enum: {
        values: ["Public", "Private"],
        message: "Invalid `{PATH}` with value of `{VALUE}`",
      },
      default: "Public",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Video = model("Video", videoSchema);

export default Video;
