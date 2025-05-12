/**
 * feat: add reusable ownershipCheck middleware to validate resource ownership across models
Introduced a dynamic middleware factory to centralize ownership validation for any Mongoose model 
(e.g., Video, Tweet, Comment). Ensures that only the resource owner can access or modify the 
resource, reducing repetition and improving consistency in authorization logic across routes.
 */

import ApiError from "../utils/API_error.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { checkObjectID } from "../utils/checkFields.utils.js";

const ownershipCheck = (
  Model,
  paramKey,
  docName = "resourceDoc",
  notFoundMsg = "Resource not found"
) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params[paramKey];

    checkObjectID(id, `${paramKey} is invalid`);

    const doc = await Model.findById(id);
    if (!doc) {
      throw new ApiError(404, notFoundMsg);
    }

    if (!doc.owner.equals(req.user._id)) {
      throw new ApiError(403, `You're not authorized to access this resource`);
    }

    req[docName] = doc;
    next();
  });

export default ownershipCheck;
