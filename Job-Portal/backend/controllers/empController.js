import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { compare } from "bcrypt";
import multer from "multer";
import { Job } from "../models/jobSchema.js";

export const empRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    userName,
    email,
    password,
    address,
    currentWorkSpace,
    experience,
    designation,
  } = req.body;

  if (!userName || !email || !password) {
    return next(new ErrorHandler("Fill the required details", 400));
  }

  const isExist = await User.findOne({ email });
  if (isExist?.role === "Employee") {
    return next(
      new ErrorHandler("User with this email already Registered!", 400)
    );
  }

  const employeeUser = await User.create({
    userName,
    email,
    password,
    address,
    currentWorkSpace,
    designation,
    experience,
    role: "Employee",
  });

  await generateToken(employeeUser, "User succesfully registere!", 200, res);
});

export const empLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return next(new ErrorHandler("Fill the required details", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm-Password Do not Match!", 400)
    );
  }

  const isExist = await User.findOne({ email }).select("+password");
  if (!isExist) {
    return next(new ErrorHandler("User not found, Please registered!", 400));
  }

  if (isExist.role !== "Employee") {
    return next(new ErrorHandler("User with this role not found", 400));
  }

  const isPasswordMatch = await isExist.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is invalid!", 400));
  }

  await generateToken(isExist, "User LoggedIn Succesfully", 200, res);
});

export const uploadResume = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("Provide Your Resume!", 400));
  }

  const resume = req.file;
  const allowedFormats = ["application/pdf", "application/msword"];

  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("File Type is not supported!", 400));
  }

  const originalName = resume.originalname
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[^a-zA-Z0-9_-]/g, "_"); // replace illegal chars
  const publicId = `${Date.now()}_${originalName}`;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "my_app_uploads", resource_type: "raw", public_id: publicId },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  res.status(200).json({
    success: true,
    message: "Resume Uploaded Successfully!",
    url: result.secure_url,
    public_id: result.public_id,
  });
});


