import mongoose from "mongoose";
import { User } from "./userSchema.js";
import validator from "validator";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "job title is required!"],
    maxLength: [30, "Job title must contain less then 30 characters!"],
  },
  description: {
    type: String,
    maxLength: [600, "Description must contain less then 600 words"],
  },
  location: {
    type: String,
    maxLength: [30, "Provide valid loaction"],
  },
  salary: {
    type: Number,
  },
  deadline: {
    type: String,
  },
  company: {
    type: String,
    required: true,
    maxLength: [60, "Enter valid company!"],
  },
  applicant_id: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: true,
  },
  status: {
    type: String,
    default: "Open",
    enum: ["Open", "Closed"],
  },
  jobId: {
    type: String,
    required: true,
    minLength: [6, "Job Id must contain exact 6 characters"],
    maxLength: [6, "Job Id must contain exact 6 characters"],
  },
  resume: {
    public_id: String,
    url: String,
  },
});

export const Job = mongoose.model("Job", jobSchema);
