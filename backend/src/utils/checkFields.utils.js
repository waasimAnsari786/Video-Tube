/**
 * Utility for validating fields and ObjectIDs.
 *
 * - checkFields: Validates required string fields (all or any).
 * - checkObjectID: Validates MongoDB ObjectIDs.
 */

import mongoose from "mongoose";
import ApiError from "./API_error.utils.js";

const checkFields = (fields, message, requireAll = true) => {
  let isValid = null;

  if (requireAll) {
    isValid = fields.every(
      field => field && typeof field === "string" && field.trim()
    );
  } else {
    isValid = fields.some(
      field => field && typeof field === "string" && field.trim()
    );
  }

  if (!isValid) {
    throw new ApiError(
      400,
      message || "Invalid or missing required fields",
      "VALIDATION_INVALID_FIELDS" // ✅ error code
    );
  }
};

// Validate MongoDB ObjectID
const checkObjectID = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,
      message || "Invalid ObjectID",
      "VALIDATION_INVALID_OBJECT_ID" // ✅ error code
    );
  }
};

export { checkFields, checkObjectID };
