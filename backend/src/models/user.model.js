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
          return /^[a-zA-Z0-9_]{3,20}$/.test(value); // Example: Allow alphanumeric + underscore, 3-20 chars
        },
        message:
          "User name must be 3-20 characters long and contain only letters, numbers, or underscores",
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
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Email regex validation
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
      minlength: [6, "Password must be at least 6 characters long"], // Minimum length validation
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
// method for checking password
userSchema.methods.isPasswordCorrect = async function (passsword) {
  return jwt.verify(this.passsword, passsword);
};

const User = model("User", userSchema);

export default User;
