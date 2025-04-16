import { Router } from "express";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Global auth check
subscriptionRouter.use(verifyAuthorization);

subscriptionRouter
  .route("/:channelId")
  .post(toggleSubscription)
  .delete(toggleSubscription);

export default subscriptionRouter;
