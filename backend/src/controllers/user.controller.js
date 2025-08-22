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

    // ✅ Step 4: save user with refresh token and prepare response
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};

const googleCallback = async (req, res) => {
  if (!req.user) {
    return res.redirect(
      `http://localhost:5173/auth?error=${encodeURIComponent(
        "Authentication Failed"
      )}`
    );
  }

  const { user } = req;
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  res
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000,
    });

  return res.redirect("http://localhost:5173");
};

const registerUser = asyncHandler(async (req, res, _) => {
  // ✅ Step 1: Extract user data from the request body
  const { userName, email, fullName, password } = req.body;

  // ✅ Step 2: Check if all required fields are provided
  checkFields([userName, fullName, email, password], "All fields are required");

  // ✅ Step 3: Check if a user already exists with google.gooEmail, userName, or email
  const existedUser = await User.findOne({
    $or: [{ "google.gooEmail": email }, { userName }, { email }],
  });

  if (existedUser) {
    // 👉 Check if email matches with a Google-registered user
    if (existedUser.google?.gooEmail === email) {
      throw new ApiError(
        400,
        "User with the provided email does exist. Please do login via Google instead of submitting this form."
      );
    }

    // 👉 Check if email or userName conflicts with an existing account
    if (existedUser.email === email || existedUser.userName === userName) {
      throw new ApiError(
        401,
        "User exists with email or user-name. Please do login."
      );
    } else {
      // This handles rare edge cases where email doesn't match but some other user has the same Google ID
      throw new ApiError(
        500,
        "Unexpected user conflict during register the user."
      );
    }
  }

  // ✅ Step 4: Create a new user in the database
  const createdUser = await User.create({
    userName,
    fullName,
    email,
    password,
  });

  // ✅ Step 5: Ensure user creation succeeded
  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }

  const user = await User.findById(createdUser._id)
    .select("email", "_id", "isEmailVerified")
    .lean();

  // ✅ Step 6: Respond with success (without returning sensitive fields)
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
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
      .json(new ApiResponse(200, {}, "Verification link sent to your email."));
  }

  if (verificationType === "otp") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const html = `<h2>Hello ${user.fullName || user.userName},</h2>
    <p>For verifying your email in VideoTube, your OTP is: <strong>${otp}</strong></p>`;

    await sendEmail({
      to: user.email,
      subject: "Email Verification Request from VideoTube",
      html,
    });

    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent to your email"));
  }
});

const verifyEmailByLink = asyncHandler(async (req, res) => {
  const { verificationToken } = req.body;
  const user = req.user; // Assuming user is already populated from middleware

  // 1. Check if token is provided
  if (!verificationToken) {
    throw new ApiError(400, "Invalid or missing verification token");
  }

  // 2. Verify the token
  let decodedVerificationToken;
  try {
    decodedVerificationToken = jwt.verify(
      verificationToken,
      process.env.VERIFICATION_TOKEN_SECRET
    );
  } catch (err) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  // 3. Validate token’s _id matches user._id
  if (String(user._id) !== decodedVerificationToken._id) {
    throw new ApiError(400, "Verification token does not match the user");
  }

  // 4. Update user as verified
  user.isEmailVerified = true;

  // 5. Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  // 6. Return response with cookies and success message
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Email verified and user logged-in successfully"
      )
    );
});

const verifyEmailByOTP = asyncHandler(async (req, res) => {
  const user = req.user;
  const { otp } = req.body;

  // 1. Check if OTP is provided
  if (!otp) {
    throw new ApiError(400, "OTP is required for verification");
  }

  // 2. Validate the OTP
  const isOtpInvalid =
    !user.emailVerificationOtp ||
    user.emailVerificationOtp !== otp ||
    user.emailVerificationOtpExpires < new Date();

  if (isOtpInvalid) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // 3. Mark email as verified and clear OTP fields
  user.isEmailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpires = undefined;

  // 4. Generate access and refresh tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  // 5. Return response with cookies and success message
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Email verified and user logged-in via OTP"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if required fields are provided
  checkFields([email, password], "Email and password are required");

  // 2. Check if user exists by matching the email
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(404, "User not found with this email");
  }

  // 3. Check if email is verified
  if (!existingUser.isEmailVerified) {
    throw new ApiError(401, "Email is not verified. Please verify first.");
  }

  // 4. Compare password with saved hash
  const isPasswordCorrect = await existingUser.comparePassword(password.trim());

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password. Please try again.");
  }

  // 5. Generate access and refresh tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(existingUser);

  // 6. Return response with cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "User logged-in successfully"
      )
    );
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

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(400, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id);

  if (!user || token !== user.refreshToken) {
    throw new ApiError(400, "Invalid or expired refresh token. Try to login.");
  }

  const { refreshToken, accessToken } =
    await generateAccessAndRefreshTokens(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json(
      new ApiResponse(
        200,
        { refreshToken, accessToken },
        "Access token refreshed successfully"
      )
    );
});

const updatePasswordViaOldPassword = asyncHandler(async (req, res, _) => {
  // extract old,new,confirm passwords from req.body
  // match new and confirm passwords must same. If not throw error
  // get user by req._id
  // check is old password correct by decoding it. if not throw error
  // update password
  // return response

  if (req.isGoogleUser) {
    throw new ApiError(400, "User is not allowed to update password");
  }

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

const sendUpdatePasswordOTP = asyncHandler(async (req, res, _) => {
  if (req.isGoogleUser) {
    throw new ApiError(400, "User is not allowed to update password");
  }

  const user = req.user;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP

  // Send email
  try {
    await sendEmail({
      to: user.email,
      subject: "OTP for Password Update",
      html: `<h4>Your OTP for updating password is: <strong>${otp}</strong></h4>
             <p>This OTP will expire in 30 seconds.</p>`,
    });
  } catch (err) {
    console.error("Failed to send update password OTP email:", err);
    throw new ApiError(
      500,
      "Internal server error: Failed to send OTP to your email"
    );
  }

  const otpExpiry = new Date(Date.now() + 30 * 1000); // 30 seconds from now

  user.updatePasswordOtp = otp;
  user.updatePasswordOtpExpires = otpExpiry;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `OTP sent successfully to your registered email address ${user.email}`
      )
    );
});

const verifyUpdatePasswordOTP = asyncHandler(async (req, res, _) => {
  if (req.isGoogleUser) {
    throw new ApiError(400, "User is not allowed to update password");
  }

  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required for verification");
  }

  const user = req.user;

  const isOtpInvalidOrExpired =
    !user.updatePasswordOtp ||
    user.updatePasswordOtp !== otp ||
    user.updatePasswordOtpExpires < new Date();

  if (isOtpInvalidOrExpired) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Clear OTP fields from user document
  user.updatePasswordOtp = undefined;
  user.updatePasswordOtpExpires = undefined;

  // ✅ Set permission to allow password update and its expiration time
  user.canUpdatePassword = true;
  user.canUpdatePasswordExpires = new Date(Date.now() + 60 * 1000); // 1 minute from now

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP verified successfully. You can now update your password."
      )
    );
});

const updatePasswordViaOTP = asyncHandler(async (req, res, _) => {
  if (req.isGoogleUser) {
    throw new ApiError(400, "User is not allowed to update password");
  }

  const { password } = req.body;

  checkFields([password], "Password is required");

  const user = req.user;

  if (!user.canUpdatePassword || user.canUpdatePasswordExpires < new Date()) {
    throw new ApiError(
      400,
      "You are not authorized to update password or your session has expired"
    );
  }

  // Set new password — pre-save hook will hash it
  user.password = password;

  // Clear temporary OTP & permission fields
  user.canUpdatePassword = false;
  user.canUpdatePasswordExpires = undefined;
  user.updatePasswordOtp = undefined;
  user.updatePasswordOtpExpires = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, _) => {
  if (req.isGoogleUser) {
    throw new ApiError(400, "User is not allowed to update account details");
  }

  const { fullName, email } = req.body;

  checkFields([fullName, email], "Email and full name is invalid", false);

  // Check if provided values match existing ones
  if (email === req.user.email) {
    throw new ApiError(
      400,
      "New email must be different from the current email"
    );
  }

  if (fullName === req.user.fullName) {
    throw new ApiError(
      400,
      "New full name must be different from the current full name"
    );
  }

  if (fullName) {
    req.user.fullName = fullName;
  }

  if (email) {
    req.user.email = email;
  }

  // Save updated user
  await req.user.save({ validateBeforeSave: false });

  // Send response with provided data
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email, fullName },
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
    const user = req.user;

    // Define transform based on field name
    let transformParams = null;
    if (fieldName === "avatar") {
      transformParams = new CloudinaryTransform(96, 96);
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

    // Save previous file reference to delete later
    const prevFile = user[fieldName];

    // Update user field
    user[fieldName] = fileDetails;

    await user.save({ validateBeforeSave: false });

    // Delete old image if it exists
    if (prevFile?.secureURL) {
      await deleteFromCloudinary([prevFile.publicId], prevFile.resourceType);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { [fieldName]: fileDetails.secureURL },
          `${fieldName} has been updated successfully`
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

  fileToBeDeleted = undefined;
  await req.user.save();

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
  updateAccountDetails,
  updateAvatarAndCoverImage,
  deleteAvatarAndCoverImage,
  getUserChannelDetails,
  getWatchHistory,
  getCurrentUser,
  sendEmailVerification,
  verifyEmailByLink,
  verifyEmailByOTP,
  updatePasswordViaOTP,
  updatePasswordViaOldPassword,
  sendUpdatePasswordOTP,
  verifyUpdatePasswordOTP,
  googleCallback,
};
