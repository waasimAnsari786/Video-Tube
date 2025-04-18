/**
 * this method has written for checking fields will be passed in the "fields"
 * parameter valid or not? When "requireAll" will be true, this method
 * will check all passed fields in the "fields" param must be valid else
 * it will check for any one of them
 */
import mongoose from "mongoose";
import ApiError from "./API_error.utils.js";

const checkFields = (fields, message, requireAll = true) => {
  let isEmpty = null;
  if (requireAll) {
    isEmpty = fields.some(field => !field || !field.trim());
  } else {
    isEmpty = fields.every(field => !field || !field.trim());
  }

  if (isEmpty) {
    throw new ApiError(400, message || "All fields are required");
  }
};

//  This method has written for getting validate all the ObjectIDs which will be comming in request
const checkObjectID = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message);
  }
};

export { checkFields, checkObjectID };
