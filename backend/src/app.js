import express, { json, urlencoded, static as static_ } from "express";
import { userRouter } from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error-handling.middleware.js";
import { videoRouter } from "./routes/video.route.js";

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
// Error Handling Middleware
app.use(errorHandler);

export default app;
