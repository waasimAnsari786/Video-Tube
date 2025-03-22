import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.utils.js";
import User from "../models/user.model.js";
import { COOKIE_OPTIONS } from "../constants.js";

const registerUser = asyncHandler(async (req, res, _) => {
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

  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) {
    throw new ApiError(401, "User exists with email or user-name");
  }

  const createdUser = await User.create({
    userName,
    fullName,
    email,
    password,
    avatar: "",
    coverImage: "",
    refreshToken: "",
  });

  const user = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(400, "Error while registering user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully"));

  // try {
  //   const createdUser = await User.create({
  //     userName,
  //     fullName,
  //     email,
  //     password,
  //     avatar: "",
  //     coverImage: "",
  //     refreshToken: "",
  //   });

  //   const user = await User.findById(createdUser._id).select(
  //     "-password -refreshToken"
  //   );

  //   if (!user) {
  //     throw new ApiError(400, "Error while registering user");
  //   }

  //   return res
  //     .status(200)
  //     .json(new ApiResponse(200, user, "User registered successfully"));
  // } catch (error) {
  //   const errors = error.errors
  //     ? Object.values(error.errors).map(err => err.message)
  //     : [error.message];
  //   throw new ApiError(400, "Error while registering user", errors);
  // }
});

// const generateAccessAndRefreshTokens = async user => {
//   // generate access and refresh tokens
//   // save refresh token on user.refreshToken
//   // save user in DB
//   // return user

//   try {
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     const updatedUser = await User.findByIdAndUpdate(
//       user._id,
//       {
//         $set: { refreshToken: refreshToken },
//       },
//       { new: true }
//     ).select("-password -refreshToken");

//     // if (!updatedUser) {
//     //   throw new ApiError(500, "Error while saving refresh token in DB");
//     // }

//     return { updatedUser, accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(error.message);
//   }
// };

// const loginUser = asyncHandler(async (req, res, next) => {
//   // get data from req.body
//   // check that all fields are empty or not. If any of them is throw error
//   // check does user exist in DB? if he doens't throw error
//   // check is user's provided password correct
//   // generate access and refresh tokens
//   // set tokens in user's browser's cookies
//   // return response

//   const { email, password } = req.body;
//   if (!email || !password) {
//     throw new ApiError(400, "Email and passsword are required");
//   }

//   const existedUser = await User.findOne({ email });

//   if (!existedUser) {
//     throw new ApiError(401, "User doesn't exist");
//   }

//   const isPasswordCorrect = await existedUser.isPasswordCorrect(password);
//   if (!isPasswordCorrect) {
//     throw new ApiError(401, "Provided password isn't correct");
//   }

//   const { updatedUser, accessToken, refreshToken } =
//     await generateAccessAndRefreshTokens(existedUser);

//   if (!accessToken || !refreshToken || !updatedUser) {
//     throw new ApiError(500, "Error while generating refresh and access tokens");
//   }

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, COOKIE_OPTIONS)
//     .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
//     .json(new ApiResponse(200, updatedUser, "User logged-in successfully"));
// });

export { registerUser };
