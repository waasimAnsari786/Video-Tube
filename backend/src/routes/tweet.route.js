import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import validateFileType from "../middlewares/validateFileType.middleware.js";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import ownershipCheck from "../middlewares/ownershipCheck.middleware.js";
import Tweet from "../models/tweet.model.js";

import {
  createTweet,
  deleteTweet,
  getTweets,
  updateTweetTextContent,
  updateTweetMedia,
} from "../controllers/tweet.controller.js";

const tweetRouter = Router();

//  Apply auth globally
tweetRouter.use(verifyAuthorization);

//  Routes that don’t need ownership check
tweetRouter
  .route("/")
  .post(
    upload.fields([
      { name: "tweetImg", maxCount: 2 },
      { name: "tweetVideo", maxCount: 2 },
    ]),
    validateFileType,
    createTweet
  ) // Assuming you already handle media inside controller
  .get(getTweets);
// Ownership check applied for routes with :tweetId
tweetRouter.use(
  ["/text/:tweetId", "/images/:tweetId", "/videos/:tweetId", "/:tweetId"],
  ownershipCheck(Tweet, "tweetId", "tweetDoc", "Tweet not found")
);

//  Text-only update
tweetRouter.route("/text/:tweetId").patch(updateTweetTextContent);

//  Dynamic media update — works for both tweetImg and tweetVideo
tweetRouter.route("/images/:tweetId").patch(
  upload.array("tweetImg", 2), // Default to 'tweetImg' (can be overridden by frontend)
  validateFileType,
  updateTweetMedia
);
tweetRouter.route("/videos/:tweetId").patch(
  upload.array("tweetVideo", 2), // Default to 'tweetImg' (can be overridden by frontend)
  validateFileType,
  updateTweetMedia
);

//  Get / Delete tweet
tweetRouter.route("/:tweetId").delete(deleteTweet);

export default tweetRouter;
