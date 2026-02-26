import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

export const isEmployerAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.employertoken;

    if (!token) {
      return next(new ErrorHandler("Employer is not Authenticated!", 400));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);

    if (req.user.role !== "Employer") {
      return next(
        new ErrorHandler("User do not permission to access this service!", 400)
      );
    }
    next();
  }
);

export const isEmpAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.employeetoken;

  if (!token) {
    return next(new ErrorHandler("Employee is not Authenticated!", 400));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decode.id);

  if (req.user.role !== "Employee") {
    return next(
      new ErrorHandler("User do not permission to access this service!", 400)
    );
  }
  next();
});
