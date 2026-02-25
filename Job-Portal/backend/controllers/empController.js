import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import express from "express";
import { generateToken } from "../utils/jwtToken.js";
import { compare } from "bcrypt";

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

  if(isExist.role !== "Employee") {
    return next(new ErrorHandler("User with this role not found", 400))
  }

  const isPasswordMatch = await isExist.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Password is invalid!", 400));
  }

  await generateToken(isExist, "User LoggedIn Succesfully", 200, res);
});
