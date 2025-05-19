import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    targetId: {
      type: String,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Like = model("Like", likeSchema);

export default Like;
