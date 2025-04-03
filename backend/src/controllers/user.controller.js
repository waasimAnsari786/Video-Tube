import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import ApiError from "../utils/API_error.utils.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.utils.js";
import User from "../models/user.model.js";
import { COOKIE_OPTIONS, IMAGE_EXTENTIONS } from "../constants.js";
import checkFields from "../utils/checkFields.utils.js";
import deleteFileFromLocalServer from "../utils/deleteFileFromLocalServer.utils.js";

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
      avatar: {},
      coverImage: {},
      refreshToken: "",
    });

    const user = await User.findById(createdUser._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(500, "Error while registering user");
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
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw error;
    } else if (error.name === "ApiError") {
      throw new ApiError(
        400,
        error.message || "Refresh token has been expired or invalid"
      );
    }
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

const updateAvatarAndCoverImage = asyncHandler(async (req, res, _) => {
  // check - request.file has properties?
  // check - is requested file's extension valid?
  // check for previous file
  // if previous file exists, delete it and then upload new one else upload new one
  // return response

  try {
    if (Object.keys(req.file).length === 0) {
      throw new ApiError(400, "Image is required");
    }

    if (!IMAGE_EXTENTIONS.includes(`.${req.file.realFileType}`)) {
      throw new ApiError(
        400,
        `Invalid file type "${req.file.realFileType}" of requested file: Allowed ${IMAGE_EXTENTIONS.join(", ")}`
      );
    }
    /* initialize variable for using requested file's field name in the form in frontend because
    form's fieldname is match with my DB's fieldname */
    const fieldName = req.file.fieldname;
    // user's previous file
    const prevFile = req.user[fieldName];
    if (prevFile?.secureURL) {
      const deletedFile = await deleteFromCloudinary(
        prevFile?.publicId,
        "image"
      );
      if (!deletedFile) {
        throw new ApiError(
          500,
          `Internal server error while deleting previous ${fieldName}`
        );
      }
    }

    const uploadedFile = await uploadOnCloudinary(req.file.path, "image");
    const fileDetails = {
      secureURL: uploadedFile.secure_url,
      resourceType: uploadedFile.resource_type,
      publicId: uploadedFile.public_id,
    };

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
      throw new ApiError(
        500,
        "Internal server error while updating user after file uploading"
      );
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
    throw new ApiError(error.statusCode, error.message);
  }
});

const deleteAvatarAndCoverImage = asyncHandler(async (req, res, _) => {
  // extract file's publicId and field's name from req.body
  // check is fieldName valid?
  // check if user have already avatar or coverImage
  // match - both received and saved publicIds.
  // if they'll be matched, delete file
  // return response
  const { fieldName, filePublicId } = req.body;

  if (!filePublicId) {
    throw new ApiError(400, "File's public Id is missing");
  }

  if (!["avatar", "coverImage"].includes(fieldName)) {
    throw new ApiError(400, "Invalid fieldName provided");
  }

  const fileToBeDeleted = req.user[fieldName];

  // this check is for cheking, does user have any previous avatar or coverImage?
  /**
   * avatar and coverImage's structure is lik this in DB
   *  avatar: {
      secureURL: undefined,
      resourceType: undefined,
      publicId: undefined,
    },
    when user don't have any avatar or coverImage."Object.values(fileToBeDeleted)" this code
    creates an array "[undefined, undefined, undefined]" of all undefined values of
    avatar or coverImage's object's each property and then this code ".every(val => val === undefined)"
    checks if all values of array are undefined means user don't have avatar or coverImage,
    throw error
   */
  if (Object.values(fileToBeDeleted).every(val => val === undefined)) {
    throw new ApiError(400, `User doesn't have ${fieldName}`);
  }

  if (filePublicId !== fileToBeDeleted.publicId) {
    throw new ApiError(
      400,
      `${fieldName} with the requested publicId doesn't exist`
    );
  }

  const deletedFile = await deleteFromCloudinary(
    filePublicId,
    fileToBeDeleted.resourceType
  );
  if (!deletedFile) {
    throw new ApiError(500, "Internal server error while deleting file");
  }

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
};
