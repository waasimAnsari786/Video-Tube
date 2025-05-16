import mediaSchema from "./media.model.js";
import { Schema, model } from "mongoose";

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
      default: "",
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
const Tweet = model("Tweet", tweetSchema);
export default Tweet;
