import mongoose from "mongoose";
import validator from "validator";
import { User } from "./userSchema.js";
import { Job } from "./jobSchema.js";

const applicationSchema = new mongoose.Schema({
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
  job_id: {
    type: String,
    required: true,
  },
});

export const Application = mongoose.model("Application", applicationSchema);
