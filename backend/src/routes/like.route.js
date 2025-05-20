import { Router } from "express";
import verifyAuthorization from "../middlewares/verifyAuthorization.middleware.js";
import { toggleLike } from "../controllers/like.controller.js";

const likeRouter = Router();

//  Routes that don’t need ownership check
likeRouter.use(verifyAuthorization);
likeRouter.route("/like/:targetId/:modelName").post(toggleLike);
likeRouter.route("/unlike/:targetId/:modelName").delete(toggleLike);

export default likeRouter;
