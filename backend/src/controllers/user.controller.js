import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js";
import User from "../models/user.model.js";
import {
  COOKIE_OPTIONS,
  GOOGLE_CLIENT,
  GOOGLE_CLIENT_ID,
  IMAGE_EXTENTIONS,
  USER_EXCLUDED_FIELDS,
} from "../constants.js";
import { checkFields } from "../utils/checkFields.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";
import FileDetails from "../utils/fileObject.utils.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CloudinaryTransform from "../utils/fileTransformParams.utils.js";
import validateFileExtensions from "../utils/checkFileExtension.utils.js";
import sendEmail from "../utils/sendEmail.utils.js";

const generateAccessAndRefreshTokens = async user => {
  try {
    // Step 1: Check if user is provided
    if (!user) {
      console.error("User is missing for generating tokens");
      throw new ApiError(500, "Internal server error while generating tokens");
    }

    // Step 2: Generate access token using the user method
    const accessToken = user.generateAccessToken();
    if (!accessToken) {
      console.error("Error while generating access-token");
      throw new ApiError(500, "Internal server error while generating tokens");
    }

    // Step 3: Generate refresh token using the user method
    const refreshToken = user.generateRefreshToken();
    if (!refreshToken) {
      console.error("Error while generating refresh-token");
      throw new ApiError(500, "Internal server error while generating tokens");
    }

    // Step 4: Save the generated refresh token in the database using $set
    // Step 5: Exclude unnecessary fields (like image publicId/resourceType and password) from the returned document
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { refreshToken },
      },
      { new: true } // return the updated document
    )
      .select(USER_EXCLUDED_FIELDS)
      .lean(); // convert Mongoose document to a plain JS object

    // Step 6: Handle case where user update failed
    if (!updatedUser) {
      console.error("Error while updating user after creating tokens");
      throw new ApiError(
        500,
        "Internal server error while updating user with refresh token"
      );
    }

    // Step 7: Attach the newly generated access token to the updated user object
    updatedUser.accessToken = accessToken;

    // Step 8: Return the user object with access token
    return updatedUser;
  } catch (error) {
    // Step 9: Log and rethrow any caught errors
    console.error("Token generation error:", error);
    throw error;
  }
};

const registerUser = asyncHandler(async (req, res, _) => {
  // Step 1: Extract user data from the request body
  const { userName, email, fullName, password } = req.body;

  // Step 2: Check if all required fields are provided
  checkFields([userName, fullName, email, password], "All fields are required");

  // Step 3: Check if a user already exists with same userName or email
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) {
    throw new ApiError(
      401,
      "User exists with email or user-name. Please do login."
    );
  }

  // Step 4: Create a new user in the database
  const createdUser = await User.create({
    userName,
    fullName,
    email,
    password,
  });

  // Step 5: Ensure user creation succeeded
  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }

  // Step 6: Respond with success (without returning sensitive fields)
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { createdUser },
        "User registered successfully. Please verify your email."
      )
    );
});

const sendEmailVerification = asyncHandler(async (req, res) => {
  const { verificationType } = req.body;
  const user = req.user;

  if (!verificationType || !["link", "otp"].includes(verificationType)) {
    throw new ApiError(400, "Invalid or missing verification type");
  }

  if (verificationType === "link") {
    const emailVeficationToken = user.generateEmailVerificationToken();
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${emailVeficationToken}&email=${user.email}`;

    const html = `<h2>Hello ${user.fullName || user.userName},</h2>
      <p>Please verify your email by clicking the link:</p>
      <a href="${url}" target="_blank">${url}</a>`;

    await sendEmail({
      to: user.email,
      subject: "Email Verification Request from VideoTube",
      html,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Verification link sent."));
  }

  if (verificationType === "otp") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const html = `<h2>Hello ${user.fullName || user.userName},</h2>
      <p>For verifying your email in VideoTube, your OTP is: <strong>${otp}</strong></p>`;

    await sendEmail({
      to: user.email,
      subject: "Email Verification Request from VideoTube",
      html,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent to your email"));
  }

  throw new ApiError(400, "Invalid verification type");
});

const verifyEmailByLink = asyncHandler(async (req, res) => {
  const { verificationToken } = req.body;
  const user = req.user;

  if (!verificationToken) {
    throw new ApiError(400, "Invalid or missing verification token");
  }

  let decodedVerificationToken;
  try {
    decodedVerificationToken = jwt.verify(
      verificationToken,
      process.env.VERIFICATION_TOKEN_SECRET
    );
  } catch (err) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  if (String(user._id) !== decodedVerificationToken._id) {
    throw new ApiError(400, "Verification Token does not match the user");
  }

  user.isEmailVerified = true;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified via link"));
});

const verifyEmailByOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  if (
    !user.emailVerificationOtp ||
    user.emailVerificationOtp !== otp ||
    user.emailVerificationOtpExpires < new Date()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.isEmailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully via OTP"));
});

const googleSignup = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // Step 1: Verify Google ID token
  const ticket = await GOOGLE_CLIENT.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, name, picture } = payload;

  // Step 2: Check if user already exists using google.gooID
  let user = await User.findOne({ "google.gooID": sub });

  if (!user) {
    // Step 3: If new user, create user with google subdocument
    user = await User.create({
      google: {
        gooID: sub,
        gooEmail: email,
        gooName: name,
        gooPic: picture,
      },
      isEmailVerified: true,
    });
  }

  const updatedUser = await generateAccessAndRefreshTokens(user);

  // Step 4: Set cookies and return response
  return res
    .cookie("accessToken", updatedUser.accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", updatedUser.refreshToken, COOKIE_OPTIONS)
    .status(201)
    .json(
      new ApiResponse(
        201,
        updatedUser,
        "User logged in successfully via Google."
      )
    );
});

const loginUser = asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;

  checkFields([email, password], "Email and password are required");

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordCorrect = await existedUser.comparePassword(password.trim());

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Provided password is incorrect");
  }

  const updatedUser = await generateAccessAndRefreshTokens(existedUser);

  return res
    .status(200)
    .cookie("accessToken", updatedUser.accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", updatedUser.refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, updatedUser, "User logged-in successfully"));
});

const logoutUser = asyncHandler(async (req, res, _) => {
  req.user.refreshToken = "";
  await req.user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, _) => {
  const user = await User.findById(req.user._id)
    .select(USER_EXCLUDED_FIELDS)
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
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

  const updatedUser = await generateAccessAndRefreshTokens(user);

  return res
    .status(200)
    .cookie("accessToken", updatedUser.accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", updatedUser.refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, updatedUser, "Token refreshed successfully"));
});

const updatePassword = asyncHandler(async (req, res, _) => {
  // extract old,new,confirm passwords from req.body
  // match new and confirm passwords must same. If not throw error
  // get user by req._id
  // check is old password correct by decoding it. if not throw error
  // update password
  // return response

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
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, _) => {
  // extract account details from req.body
  // check - is requested data valid?
  // update user
  // return response

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
  )
    .select(`${USER_EXCLUDED_FIELDS} -refreshToken`)
    .lean();

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
});

const updateAvatarAndCoverImage = asyncHandler(async (req, res, _) => {
  try {
    if (!req.file || Object.keys(req.file).length === 0) {
      throw new ApiError(400, "No file uploaded");
    }

    validateFileExtensions([req.file], IMAGE_EXTENTIONS);

    const fieldName = req.file.fieldname;

    // Define transform based on field name
    let transformParams = null;

    if (fieldName === "avatar") {
      transformParams = new CloudinaryTransform(100, 100);
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
    )
      .select(`${fieldName}.secureURL`)
      .lean();

    if (!updatedUser) {
      throw new ApiError(500, "Internal server error while updating user");
    }

    const prevFile = req.user[fieldName];
    if (prevFile?.secureURL) {
      await deleteFromCloudinary([prevFile?.publicId], prevFile?.resourceType);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          `${fieldName} has updated successfully`
        )
      );
  } catch (error) {
    deleteFileFromLocalServer([req.file]);
    throw error;
  }
});

const deleteAvatarAndCoverImage = asyncHandler(async (req, res, _) => {
  // Extract the last part of the URL path (either 'avatar' or 'cover')
  // create a variable for storing the field name
  // extract field from user object
  // check - does user have file associated with the extracted field name
  // delte file from cloudinary
  // update user in DB
  // return response
  const pathSegment = req.originalUrl.split("/").pop(); // 'avatar' or 'cover'

  const expectedField = pathSegment === "avatar" ? "avatar" : "coverImage";

  const fileToBeDeleted = req.user[expectedField];

  /* this check is for cheking, does user have any previous avatar or coverImage by checking 
    that is "fileToBeDeleted" null object or if it has its values, are these values undefined?
    Because due to some reasons avatar and cover image's fields contains an object wheather 
    user have uploaded file in it or not.*/

  if (
    !fileToBeDeleted ||
    Object.values(fileToBeDeleted).every(val => val === undefined)
  ) {
    throw new ApiError(400, `User doesn't have ${expectedField}`);
  }

  await deleteFromCloudinary(
    [fileToBeDeleted.publicId],
    fileToBeDeleted.resourceType
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        [expectedField]: 1,
      },
    },
    { new: true }
  )
    .select(`-password -refreshToken -${expectedField}`)
    .lean();

  if (!updatedUser) {
    throw new ApiError(
      500,
      "Internal server error while updating user after file deletion"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, {}, `${expectedField} has been deleted successfully`)
    );
});

const getUserChannelDetails = asyncHandler(async (req, res) => {
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
        userName: 1,
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
  googleSignup,
  sendEmailVerification,
  verifyEmailByLink,
  verifyEmailByOTP,
};
