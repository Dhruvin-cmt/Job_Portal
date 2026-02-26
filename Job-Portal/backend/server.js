import mongoose from "mongoose";
import cloudinary from "cloudinary";
import app from "./app.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.listen(process.env.PORT, () => {
  console.log("App is listerning on :", process.env.PORT);
});
