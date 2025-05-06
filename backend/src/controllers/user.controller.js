import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js";
import User from "../models/user.model.js";
import { COOKIE_OPTIONS, IMAGE_EXTENTIONS } from "../constants.js";
import { checkFields } from "../utils/checkFields.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import FileDetails from "../utils/fileObject.utils.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CloudinaryTransform from "../utils/fileTransformParams.utils.js";

const registerUser = asyncHandler(async (req, res, _) => {
  // get auth data from req.body
  // check all fields are empty or not. If any of them is throw error
  // check does user exist already in DB? if he is throw error
  // create user in DB
  // remove password and refresh-token fields
  // return response

  const { userName, email, fullName, password } = req.body;
  try {
    checkFields([userName, fullName, email, password]);

    const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existedUser) {
      throw new ApiError(401, "User exists with email or user-name");
    }

    const createdUser = await User.create({
      userName,
      fullName,
      email,
      password,
      avatar: {},
      coverImage: {},
      refreshToken: "",
    });

    const user = await User.findById(createdUser._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(500, "Internal server error while registering user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User registered successfully"));
  } catch (error) {
    throw error;
  }
});

const generateAccessAndRefreshTokens = async user => {
  try {
    if (!user) {
      console.error("User is missing for generating tokens");
      throw new ApiError(500, "Internal server error while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    if (!accessToken) {
      console.error("Error while generating access-token");
      throw new ApiError(500, "Internal server error while generating tokens");
    }

    const refreshToken = user.generateRefreshToken();
    if (!refreshToken) {
      console.error("Error while generating refresh-token");
      throw new ApiError(500, "Internal server error while generating tokens");
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
      console.error("Error while updating user after creating tokens");
      throw new ApiError(
        500,
        "Internal server error while updating user with refresh token"
      );
    }

    updatedUser.accessToken = accessToken;
    return { updatedUser, accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};

const loginUser = asyncHandler(async (req, res, _) => {
  try {
    const { email, password } = req.body;

    checkFields([email, password], "Email and password are required");

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      throw new ApiError(404, "User doesn't exist");
    }

    const isPasswordCorrect = await existedUser.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Provided password is incorrect");
    }

    const { updatedUser, accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(existedUser);

    return res
      .status(200)
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .json(new ApiResponse(200, updatedUser, "User logged-in successfully"));
  } catch (error) {
    console.error("Login error:", error.message || error);
    throw error;
  }
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

const getCurrentUser = asyncHandler(async (req, res, _) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
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
    throw error;
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

    checkFields([oldPassword, newPassword, confirmPassword]);

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
      throw new ApiError(500, "Internal server Error while updating password");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully"));
  } catch (error) {
    throw error;
  }
});

const updateAccountDetails = asyncHandler(async (req, res, _) => {
  // extract account details from req.body
  // check - is requested data valid?
  // update user
  // return response

  try {
    const { fullName, email } = req.body;

    checkFields([fullName, email], "Email and full name is invalid", false);

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
    throw error;
  }
});

const updateAvatarAndCoverImage = asyncHandler(async (req, res, _) => {
  try {
    if (!IMAGE_EXTENTIONS.includes(`.${req.file.realFileType}`)) {
      throw new ApiError(
        400,
        `Invalid file type "${req.file.realFileType}" of requested file: Allowed ${IMAGE_EXTENTIONS.join(", ")}`
      );
    }

    const fieldName = req.file.fieldname;

    // Define transform based on field name
    let transformParams = null;

    if (fieldName === "avatar") {
      transformParams = new CloudinaryTransform(80, 80);
    } else if (fieldName === "coverImage") {
      transformParams = new CloudinaryTransform(256, 1200);
    }

    const uploadedFile = await uploadOnCloudinary(
      req.file.path,
      "image",
      transformParams
    );

    const fileDetails = new FileDetails(
      uploadedFile.secure_url,
      uploadedFile.resource_type,
      uploadedFile.public_id
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          [fieldName]: fileDetails,
        },
      },
      { new: true }
    ).select(`-password -refreshToken -${fieldName}`);

    if (!updatedUser) {
      throw new ApiError(500, "Internal server error while updating user");
    }

    const prevFile = req.user[fieldName];
    if (prevFile?.secureURL) {
      await deleteFromCloudinary(prevFile?.publicId, prevFile?.resourceType);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          fileDetails,
          `${fieldName} has updated successfully`
        )
      );
  } catch (error) {
    deleteFileFromLocalServer(req.file.path);
    throw error;
  }
});

const deleteAvatarAndCoverImage = asyncHandler(async (req, res, _) => {
  // extract file's publicId and field's name from req.body
  // check is fieldName valid?
  // check - does user send correct field name to the correct endpoint
  // check if user have already avatar or coverImage
  // match - both received and saved publicIds.
  // if they'll be matched, delete file
  // return response

  try {
    const { fieldName, filePublicId } = req.body;

    if (!filePublicId) {
      throw new ApiError(400, "File's public Id is missing");
    }

    if (!["avatar", "coverImage"].includes(fieldName)) {
      throw new ApiError(400, "Invalid fieldName provided");
    }

    // Extract the last part of the URL path (either 'avatar' or 'cover')
    const pathSegment = req.originalUrl.split("/").pop(); // 'avatar' or 'cover'

    const expectedField = pathSegment === "avatar" ? "avatar" : "coverImage";

    if (fieldName !== expectedField) {
      throw new ApiError(
        400,
        `You are trying to delete '${fieldName}' via '${expectedField}' route. Please use the correct endpoint.`
      );
    }

    const fileToBeDeleted = req.user[fieldName];

    /* this check is for cheking, does user have any previous avatar or coverImage by checking 
    that is "fileToBeDeleted" null object or if it has its values, are these values undefined?
    Because due to some reasons avatar and cover image's fields contains an object wheather 
    user have uploaded file in it or not.*/

    if (
      !fileToBeDeleted ||
      Object.values(fileToBeDeleted).every(val => val === undefined)
    ) {
      throw new ApiError(400, `User doesn't have ${fieldName}`);
    }

    if (filePublicId !== fileToBeDeleted.publicId) {
      throw new ApiError(
        404,
        `${fieldName} with the requested publicId doesn't exist`
      );
    }

    await deleteFromCloudinary(
      fileToBeDeleted.publicId,
      fileToBeDeleted.resourceType
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          [fieldName]: 1,
        },
      },
      { new: true }
    ).select(`-password -refreshToken -${fieldName}`);

    if (!updatedUser) {
      throw new ApiError(
        500,
        "Internal server error while updating user after file deletion"
      );
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, {}, `${fieldName} has been deleted successfully`)
      );
  } catch (error) {
    throw error;
  }
});

const getUserChannelDetails = asyncHandler(async (req, res) => {
  // extract userName
  // check - is userName valid?
  // find user with the same userName
  // get subscribers and channels subcsribed by userName
  /*
  * add fields for subcriber and subscribed channels count, is current user subscribed this channel,
  in the user object
  */
  /**
   * check is current user is the owner of the channel? If yes don't add isSubcribed field meanwhile
   * add isOwner field in the user object
   */
  // return response

  const { userName } = req.params;

  checkFields([userName], "Username is required");

  const channel = await User.aggregate([
    {
      $match: { userName },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedChannels",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedChannelsCount: {
          $size: "$subscribedChannels",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        isOwner: {
          $cond: {
            if: { $eq: [req.user?._id, "$_id"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscribedChannelsCount: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        isOwner: {
          $cond: {
            if: { $not: ["$isOwner"] },
            then: "$$REMOVE",
            else: "$isOwner",
          },
        },
        isSubscribed: {
          $cond: {
            if: { $not: ["$isOwner"] },
            then: "$isSubscribed",
            else: "$$REMOVE",
          },
        },
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel doesn't exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              video: 1,
              thumbnail: 1,
              views: 1,
              duration: 1,
              owner: 1,
            },
          },
          {
            $unwind: "$owner",
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  updateAccountDetails,
  updateAvatarAndCoverImage,
  deleteAvatarAndCoverImage,
  getUserChannelDetails,
  getWatchHistory,
  getCurrentUser,
};
