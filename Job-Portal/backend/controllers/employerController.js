import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";

export const employerRegister = catchAsyncErrors(async (req, res, next) => {
  const { userName, email, password, currentWorkSpace } = req.body;
  console.log(req.body)
  if (!userName || !email || !password) {
    return next(new ErrorHandler("Fill the required details", 400));
  }

  console.log(email)
  const isExist = await User.findOne({ email });
  if (isExist?.role === "Employer") {
    return next(
      new ErrorHandler("User with this email already Registered!", 400)
    );
  }

  const employerUser = await User.create({
    userName,
    email,
    password,
    currentWorkSpace,
    role: "Employer",
  });

  await generateToken(employerUser, "User succesfully registere!", 200, res);
});

export const employerLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Fill the required details", 400));
  }


  const isExist = await User.findOne({ email }).select("+password");
  if (!isExist) {
    return next(new ErrorHandler("User not found, Please registered!", 400));
  }

  if (isExist.role !== "Employer") {
    return next(new ErrorHandler("User with this role not found", 400));
  }

  const isPasswordMatch = await isExist.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is invalid!", 400));
  }

  await generateToken(isExist, "User LoggedIn Succesfully", 200, res);
});

export const employerMe = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const employerLogout = catchAsyncErrors(async (req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  res
    .status(200)
    .clearCookie("employertoken", {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});


