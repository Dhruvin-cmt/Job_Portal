import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "UserName is required!"],
    minLength: [3, "UserName must contains atleast 3 characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide valid details!"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [8, "Password must contains atleast 8 characters!"],
  },
  address: {
    type: String,
  },
  experience: {
    type: String,
  },
  designation: {
    type: String,
  },
  currentWorkSpace: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Employee", "Employer"],
  },
  resume: {
    public: String,
    url: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
