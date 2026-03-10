import mongoose from "mongoose";
import validator from "validator";
import { User } from "./userSchema.js";
import { Job } from "./jobSchema.js";

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "UserName must contains atleast 3 characters!"],
    maxLength: [12, "UserName must contains less then 12 characters!"],
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Provide valid email address!"],
    required: true,
  },
  resume: {
    type: Object,
    public_id: { type: String },
    url: { type: String },
    required: true,
  },
  applicant_id: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Rejected", "Short-listed"],
    default: "Pending",
  },
  job_id: {
    type: String,
    required: true,
  },
});

export const Application = mongoose.model("Application", applicationSchema);
