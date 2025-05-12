import mongoose from "mongoose";
import mediaSchema from "./media.model.js";
const { Schema } = mongoose;

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    textContent: {
      type: String,
      trim: true,
    },
    tweetImg: {
      type: [mediaSchema], // Array of media
      default: [],
    },
    tweetVideo: {
      type: [mediaSchema], // Array of media
      default: [],
    },
  },
  { timestamps: true }
);

// Export the model
export const Tweet = mongoose.model("Tweet", tweetSchema);
