import cloudinary from "cloudinary";
import app from "./app.js";
import { dbConnection } from "./database/dbConnection.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log("App is listening on :", PORT);
    });
  } catch (err) {
    console.error("Failed to start server due to DB connection error.");
    process.exit(1);
  }
};

startServer();
