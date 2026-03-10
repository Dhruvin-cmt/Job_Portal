import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";

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

// Public: get all open jobs for browse page (no auth required) with basic search
export const getPublicJobs = catchAsyncErrors(async (req, res, next) => {
  const { q, location } = req.query;

  const query = { status: "Open" };

  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), "i");
    query.$or = [
      { title: regex },
      { company: regex },
      { description: regex },
      { jobId: regex },
    ];
  }

  if (location && location.trim()) {
    query.location = new RegExp(location.trim(), "i");
  }

  const jobs = await Job.find(query).sort({ _id: -1 });

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

export const trackApplicants = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findOne({ jobId: id });
  if (!job) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  if (String(job.applicant_id) !== String(req.user?._id)) {
    return next(new ErrorHandler("You do not have access to these applications!", 403));
  }

  const jobApplicants = await Application.find({ job_id: id }).sort({ _id: -1 });

  res.status(200).json({
    success: true,
    jobApplicants,
    message: "Applicants fetch succesfully!",
  });
});

export const updateApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // application _id
  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Provide status to update application!", 400));
  }

  const allowed = ["Pending", "Rejected", "Short-listed"];
  if (!allowed.includes(status)) {
    return next(new ErrorHandler("Invalid application status!", 400));
  }

  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }

  const job = await Job.findOne({ jobId: application.job_id });
  if (!job) {
    return next(new ErrorHandler("Job not found for this application!", 404));
  }

  if (String(job.applicant_id) !== String(req.user?._id)) {
    return next(new ErrorHandler("You do not have permission to update this application!", 403));
  }

  application.status = status;
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application status updated successfully!",
    application,
  });
});
