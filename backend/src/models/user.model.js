import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "User name is required"], // Custom error message
      trim: true,
      index: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*_.*_)[a-zA-Z0-9_]{3,20}$/.test(
            value
          ); // Example: Allow alphanumeric + underscore, 3-20 chars
        },
        message:
          "User name must be 3-20 characters long and must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 underscore(_)",
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"], // Custom error message
      trim: true,
      index: true,
      validate: {
        validator: function (value) {
          return /^[\da-zA-Z]+(?:[+%._-][\da-zA-Z]+)*@(?:[-.])*[a-zA-Z\d]+(?:[-])*\.[A-Za-z]{2,}$/.test(
            value
          ); // Email regex validation
        },
        message: "Please enter a valid email address",
      },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Custom error message
      validate: {
        validator: function (value) {
          return /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/.test(
            value
          ); // Password validation regex
        },
        message:
          "Password must be at least 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character (@$!%*?&), and must not have consecutive repeating characters.",
      },
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

// "pre" middleware dor hashing password before saving user data in DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});
// method for generating access token for user
userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return accessToken;
};
// method for generating refresh token for user
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return refreshToken;
};
// method for cpmparing password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

export default User;
