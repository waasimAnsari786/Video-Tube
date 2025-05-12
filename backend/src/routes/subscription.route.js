import { Router } from "express";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Global auth check
subscriptionRouter.use(verifyAuthorization);

subscriptionRouter
  .route("/:channelId")
  .post(toggleSubscription)
  .delete(toggleSubscription);
subscriptionRouter.route("/channels/:subscriberId").get(getSubscribedChannels);
subscriptionRouter
  .route("/subscribers/:channelId")
  .get(getUserChannelSubscribers);

export default subscriptionRouter;
