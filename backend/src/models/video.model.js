import { Schema, model } from "mongoose";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"], // Custom error message
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"], // Custom error message
      trim: true,
    },
    video: {
      secureURL: { type: String, required: true },
      resourceType: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    thumbnail: {
      secureURL: { type: String, required: true },
      resourceType: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    videoStatus: {
      type: String,
      enum: {
        values: ["Public", "Private"],
        message: "Invalid `{PATH}` with value `{VALUE}`",
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
