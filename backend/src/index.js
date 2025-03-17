// import needy packages
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
// configure dotenv for passing env vars in the entire app
dotenv.config();
// execute DB connection function
connectDB()
  .then(() => {
    // confirmation message after DB connected successfully
    app.listen(
      process.env.PORT,
      console.log(
        "Server is running on port http://localhost:" + process.env.PORT
      )
    );
  })
  .catch(error => {
    // caught error while connecting DB
    console.error(error.message || "Database connection Falied");
    // prevent moving forward after catching errors
    process.exit(1);
  });
