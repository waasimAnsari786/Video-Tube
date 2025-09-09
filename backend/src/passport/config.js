import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import ApiError from "../utils/API_error.utils.js";

/** -------Session-based Approach------*/
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/v1/users/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ "google.gooID": profile.id });

//         if (!user) {
//           user = await User.create({
//             google: {
//               gooID: profile.id,
//               gooEmail: profile.emails?.[0]?.value,
//               gooName: profile.displayName,
//               gooPic: profile.photos?.[0]?.value,
//             },
//             isEmailVerified: profile._json.email_verified,
//           });
//         }
//         // directly returned user's id in passport.serializeUser()
//         return done(null, profile.id);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((userId, done) => {
//   done(null, userId); // stores userId in session
// });

// passport.deserializeUser(async (userId, done) => {
//   try {
//     const user = await User.findOne({ "google.gooID": userId });
//     done(null, user); // attaches full user to req.user
//   } catch (err) {
//     done(err, null);
//   }
// });

// export default passport;

/** -------JWT-based Approach------*/
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;

        const existingUser = await User.findOne({
          $or: [{ "google.gooID": googleId }, { email }],
        });

        let user = null;

        if (existingUser) {
          if (existingUser.email === email) {
            throw new ApiError(
              400,
              "User with this email already exists. Please log in via Email/Password instead of Google.",
              "AUTH_USER_ALREADY_EXISTS"
            );
          }

          if (existingUser.google?.gooID === googleId) {
            user = existingUser;
          } else {
            throw new ApiError(
              500,
              "Unexpected user conflict during Google signup.",
              "AUTH_UNEXPECTED_USER_CONFLICT"
            );
          }
        } else {
          user = await User.create({
            google: {
              gooID: profile.id,
              gooEmail: profile.emails?.[0]?.value,
              gooName: profile.displayName,
              gooPic: profile.photos?.[0]?.value,
            },
            isEmailVerified: profile._json.email_verified,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null); // <-- Pass ApiError forward
      }
    }
  )
);

export default passport;
