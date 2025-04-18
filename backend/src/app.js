import express, { json, urlencoded, static as static_ } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import errorHandler from "./middlewares/error-handling.middleware.js";
import subscriptionRouter from "./routes/subscription.route.js";

// create app from express
const app = express();
// fixed json data limit
app.use(json({ limit: "16kb" }));
// fixed URL-encoded data limit and allow nested objects to be parsed in the URL-encoded Data
app.use(urlencoded({ limit: "16kb", extended: true }));
// define static folder for storing temporary data
app.use(static_("./public/assets"));
// configure cookie-parser for performing CRUD on user's cookies
app.use(cookieParser());
// configure routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
// Error Handling Middleware
app.use(errorHandler);

export default app;
