import express from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { Job } from "../models/jobSchema.js";

export const applyToJob = catchAsyncErrors(async (req, res, next) => {
  const email = req.body?.email;
  if (!email) {
    return next(new ErrorHandler("Provide email for application", 400));
  }

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

  const isAlreadyApplied = await Application.findOne({
    email: req.body.email,
    job_id: req.params.id,
  });
  if (isAlreadyApplied) {
    return next(new ErrorHandler("You already applied for this Job!", 400));
  }

  const applicationOfEmp = await Application.create({
    email: req.body.email,
    resume: {
      url: result.secure_url,
      public_id: result.public_id,
      original_name: resume.originalname,
    },
    applicant_id: req.user._id,
    job_id: req.params.id,
  });

  res.status(200).json({
    success: true,
    message: "Resume Uploaded Successfully!",
    applicationOfEmp,
  });
});
