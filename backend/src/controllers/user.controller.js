import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.utils.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // get auth data from req.body
  // check all fields are empty or not. If any of them is throw error
  // check does user exist already in DB? if he is throw error
  // create user in DB
  // remove password and refresh-token fields
  // return response

  const { userName, email, fullName, password } = req.body;
  if (
    [userName, fullName, email, password].some(field => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUSer = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUSer) {
    throw new ApiError(401, "User exists with email or user-name");
  }

  const createdUSer = await User.create({
    userName,
    fullName,
    email,
    password,
    avatar: "",
    coverImage: "",
    refreshToken: "",
  });

  if (!createdUSer) {
    throw new ApiError(500, "Error while registering user");
  }

  const user = await User.findById(createdUSer._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

export { registerUser };
