import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import ownershipCheck from "../middlewares/ownershipCheck.middleware.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller.js";
import Comment from "../models/comment.model.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";

const commentRouter = Router();

//  Routes that don’t need ownership check
commentRouter.use(verifyAuthorization);
commentRouter
  .route("/")
  .post(upload.single("commentImg"), validateFileType, createComment);

// Ownership check applied for routes with :commentId
commentRouter.use(
  ["/:commentId"],
  ownershipCheck(Comment, "commentId", "commentDoc", "Comment not found")
);

commentRouter
  .route("/:commentId")
  .delete(deleteComment)
  .patch(upload.single("commentImg"), validateFileType, updateComment);

export default commentRouter;
