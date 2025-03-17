import express, { json, urlencoded, static as static_ } from "express";
import { userRouter } from "./routes/user.route.js";
import multer from "multer";
// create app from express
const app = express();
// fixed json data limit
app.use(json({ limit: "16kb" }));
// fixed URL-encoded data limit and allow nested objects to be parsed in the URL-encoded Data
app.use(urlencoded({ limit: "16kb", extended: true }));
// define static folder for storing temporary data
app.use(static_("./public/assets"));
// configure user routes
app.use("/api/v1/users", userRouter);
// Multer Error Handling Middleware
app.use((err, _, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default app;
