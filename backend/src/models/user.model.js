/**
 * User Schema
 * ----------------------------
 * This schema defines the structure for the User model in MongoDB using Mongoose.
 * It supports both traditional authentication (email/password) and third-party authentication (e.g., Google).
 *
 * Summary of Fields:
 * - userName: Required, unique username with complex validation.
 * - email: Optional (for 3rd-party auth), unique email with validation.
 * - fullName: Optional full name.
 * - password: Optional password with complexity validation. Will be hashed before save.
 * - refreshToken: Stores the latest refresh token issued to the user.
 * - avatar: Optional embedded media object (image, etc.), defined via mediaSchema.
 * - coverImage: Optional embedded media object (image, etc.), defined via mediaSchema.
 * - watchHistory: Array of video ObjectIds referencing the "Video" model.
 * - google: Subdocument containing Google-auth-specific user data (optional).
 *
 * Middleware & Methods:
 * - pre('save'): Hashes password automatically if it's modified.
 * - generateAccessToken(): Issues a JWT access token.
 * - generateRefreshToken(): Issues a JWT refresh token.
 * - comparePassword(): Compares plain password with hashed one.
 *
 * Notes:
 * - Validations apply conditionally when optional fields are provided.
 * - Supports flexible user creation via email/password or third-party OAuth.
 */

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mediaSchema from "./media.model.js"; // Subschema for media fields like avatar, cover
import googleAuthSchema from "./googleAuth.model.js"; // Subschema for Google-authenticated users

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "User name is required"],
      trim: true,
      index: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*_.*_)[a-zA-Z0-9_]{3,20}$/.test(
            value
          );
        },
        message:
          "User name must be 3-20 characters long and must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 underscore(_)",
      },
    },
    email: {
      type: String,
      unique: true,
      required: false,
      trim: true,
      index: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^[\da-zA-Z]+(?:[+%._-][\da-zA-Z]+)*@(?:[-.])*[a-zA-Z\d]+(?:[-])*\.[A-Za-z]{2,}$/.test(
            value
          );
        },
        message: "Please enter a valid email address",
      },
    },
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/.test(
            value
          );
        },
        message:
          "Password must be at least 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character (@$!%*?&), and must not have consecutive repeating characters.",
      },
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: mediaSchema, // Embedded media (e.g., profile image)
    },
    coverImage: {
      type: mediaSchema, // Embedded media (e.g., banner image)
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video", // References videos watched by the user
      },
    ],
    google: {
      type: googleAuthSchema,
      default: undefined, // Optional field, used when user logs in via Google
    },
    // ✅ Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ For OTP-based Email Verification
    emailVerificationOtp: {
      type: String,
      default: null,
    },
    emailVerificationOtpExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre-save hook: hashes password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Generates JWT access token for user
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generates JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Compares plain-text password with hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateEmailVerificationToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY,
    }
  );
};

const User = model("User", userSchema);

export default User;
