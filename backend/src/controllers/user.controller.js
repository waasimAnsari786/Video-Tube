import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.utils.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // get auth data from req.body
  // check all fields are empty or not. If any of them is throw error4

  const avatar = await uploadOnCloudinary(req.file?.path);
  // return res
  //   .status(200)
  //   .json(
  //     new ApiResponse(
  //       200,
  //       { body: req.body, files: req.files || req.file },
  //       "Data fetched successfully"
  //     )
  //   );
});

export { registerUser };
