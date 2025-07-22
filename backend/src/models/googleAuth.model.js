import { Schema } from "mongoose";

// subschema for storing user's info in "user.model.js", if he will login or signup via Google
const googleAuthSchema = new Schema(
  {
    gooID: String,
    gooName: String,
    gooEmail: String,
    gooPic: String,
  },
  { _id: false } // Prevents Mongoose from creating an _id for this subdocument
);

export default googleAuthSchema;
