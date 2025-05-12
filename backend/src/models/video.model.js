import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mediaSchema from "./media.model.js";

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

videoSchema.plugin(mongooseAggregatePaginate);

const Video = model("Video", videoSchema);

export default Video;
