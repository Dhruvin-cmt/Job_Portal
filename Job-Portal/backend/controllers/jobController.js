import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Job } from "../models/jobSchema.js";

export const publishJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    location,
    salary,
    company,
    deadline,
    jobId,
    applicant,
    status,
  } = req.body;

  if (!title || !description || !location || !company || !jobId) {
    return next(
      new ErrorHandler("Provide required details for publish job!", 400)
    );
  }

  const isJodIdDuplicate = await Job.find({ jobId: req.body.jobId });
  if (isJodIdDuplicate.length > 0) {
    return next(
      new ErrorHandler(
        "Job with simillar id already exist! use different Job Id!",
        409
      )
    );
  }

  const jobApplication = await Job.create({
    title,
    description,
    location,
    salary,
    company,
    deadline,
    jobId,
    applicant_id: req.user._id,
    status,
  });

  res.status(201).json({
    success: true,
    jobApplication,
    message: "Job Publish Succesfully!",
  });
});

export const getJobs = catchAsyncErrors(async (req, res, next) => {
  const allJobs = await Job.find({ applicant_id: req.user._id });

  res.status(200).json({
    success: true,
    message: "All Posted Job was Here!",
    allJobs,
  });
});

// Public: get all open jobs for browse page (no auth required)
export const getPublicJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ status: "Open" }).sort({ _id: -1 });

  res.status(200).json({
    success: true,
    jobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let getJobApplication = await Job.findById(id);
  if (!getJobApplication) {
    return next(new ErrorHandler("Appointment not found!", 400));
  }

  getJobApplication = await Job.findByIdAndUpdate(
    id,
    { status: req.body.status },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    getJobApplication,
    message: "Job Updated Succesfully!",
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let getJobApplication = await Job.findById(id);

  if (!getJobApplication) {
    return next(new ErrorHandler("Job Application not found!", 400));
  }

  if (getJobApplication.status === "Open") {
    return next(new ErrorHandler("Job is Open so you can not remove it!", 400));
  }

  await getJobApplication.deleteOne();

  res.status(200).json({
    success: true,
    getJobApplication,
    message: "Job Deleted Succesfully!",
  });
});
