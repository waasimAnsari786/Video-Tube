import { Schema } from "mongoose";

// Sub-schema for media (image/video)
const mediaSchema = new Schema(
  {
    secureURL: { type: String },
    resourceType: { type: String },
    publicId: { type: String },
  },
  { _id: false } // Prevents _id for each media item
);

export default mediaSchema;
