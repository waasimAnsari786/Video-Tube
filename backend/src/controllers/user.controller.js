import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.utils.js";
import User from "../models/user.model.js";
import { COOKIE_OPTIONS } from "../constants.js";
import checkFields from "../utils/checkFields.utils.js";

const registerUser = asyncHandler(async (req, res, _) => {
  // get auth data from req.body
  // check all fields are empty or not. If any of them is throw error
  // check does user exist already in DB? if he is throw error
  // create user in DB
  // remove password and refresh-token fields
  // return response

  const { userName, email, fullName, password } = req.body;
  try {
    if (checkFields([userName, fullName, email, password])) {
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
  } catch (error) {
    if (error.name === "ApiError") {
      throw new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error while registering user"
      );
    } else if (error.name === "ValidationError") {
      throw error;
    }
  }
});

const generateAccessAndRefreshTokens = async user => {
  // generate access and refresh tokens
  // save refresh token on user.refreshToken
  // save user in DB
  // return user with access and refresh tokens
  try {
    if (!user) {
      throw new ApiError(400, "User is missing for generating tokens");
    }

    const accessToken = user.generateAccessToken();
    if (!accessToken) {
      throw new ApiError(500, "Error while generating access-token");
    }

    const refreshToken = user.generateRefreshToken();
    if (!refreshToken) {
      throw new ApiError(500, "Error while generating refresh-token");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { refreshToken },
      },
      { new: true }
    )
      .select("-password")
      .lean();
    if (!updatedUser) {
      throw new ApiError(
        500,
        "Error while updating user after creating tokens"
      );
    }

    updatedUser.accessToken = accessToken;
    return { updatedUser, accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};

const loginUser = asyncHandler(async (req, res, _) => {
  // get data from req.body
  // check that all fields are empty or not. If any of them is throw error
  // check does user exist in DB? if he doens't throw error
  // check is user's provided password correct
  // generate access and refresh tokens
  // set tokens in user's browser's cookies
  // return response

  const { email, password } = req.body;
  if (checkFields([email, password])) {
    throw new ApiError(400, "Email and passsword are required");
  }

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(401, "User doesn't exist");
  }

  const isPasswordCorrect = await existedUser.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Provided password isn't correct");
  }

  const { updatedUser, accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(existedUser);

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, updatedUser, "User logged-in successfully"));
});

const logoutUser = asyncHandler(async (req, res, _) => {
  const loggedOutUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    { new: true }
  );

  if (!loggedOutUser) {
    throw new ApiError(500, "Internal server error while logging out user");
  }

  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, _) => {
  // get refresh token from cookies or header if exists, if it doesn't throw error
  // decode token
  // find user by decoded token's "_id". If there will be no user, throw error
  // match DB user's refresh token and provided refresh token through cookies or header.
  // Throw error if they aren't same
  // generate new tokens
  // set cookies in user's browser
  // retrun response with acess and refresh tokens

  try {
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "Unauthorized Request: Refresh token is missing");
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user || token !== user.refreshToken) {
      throw new ApiError(400, "Refresh token has been expired or invalid");
    }

    const { updatedUser, accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .json(new ApiResponse(200, updatedUser, "User logged-in successfully"));
  } catch (error) {
    throw new ApiError(
      400,
      error.message || "Refresh token has been expired or invalid"
    );
  }
});

const updatePassword = asyncHandler(async (req, res, _) => {
  // extract old,new,confirm passwords from req.body
  // match new and confirm passwords must same. If not throw error
  // get user by req._id
  // check is old password correct by decoding it. if not throw error
  // update password
  // return response

  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (checkFields([oldPassword, newPassword, confirmPassword])) {
      throw new ApiError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New and confirm passwords aren't same");
    }

    const user = req.user;

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Old password isn't correct");
    }

    user.password = newPassword;
    const updatedUser = await user.save();
    if (!updatedUser) {
      throw new ApiError(
        500,
        "Internal server Error: Error while updating password"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
});

const updateAccountDetails = asyncHandler(async (req, res, _) => {
  // extract account details from req.body
  // update user
  // return response

  try {
    const { fullName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName: fullName ? fullName : req.user.fullName,
          email: email ? email : req.user.email,
        },
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      throw new ApiError(
        500,
        "Internal server error while updating acccount details"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          "User account details updated successfully"
        )
      );
  } catch (error) {
    if (error.name === "ApiError") {
      throw new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error while registering user"
      );
    } else if (error.name === "ValidationError") {
      throw error;
    }
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  updateAccountDetails,
};
