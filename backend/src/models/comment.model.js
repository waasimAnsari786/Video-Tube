import { Schema, model } from "mongoose";
import mediaSchema from "./media.model.js";

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["comment", "reply"],
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId, // reply to which comment
      ref: "Comment",
      default: null,
    },
    targetId: {
      type: String,
      required: true,
    },
    commentImg: mediaSchema,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

export default Comment;
