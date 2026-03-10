import express from "express";
import {
  employerLogin,
  employerLogout,
  employerMe,
  employerRegister,
} from "../controllers/employerController.js";
import { isEmployerAuthenticated } from "../middlewares/auth.js";
import {
  deleteJob,
  getJobs,      
  publishJob,
  trackApplicants,
  updateApplication,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/register", employerRegister);
router.post("/login", employerLogin);
router.get("/me", isEmployerAuthenticated, employerMe);
router.post("/logout", isEmployerAuthenticated, employerLogout);
router.post("/jobs/publish", isEmployerAuthenticated, publishJob);
router.get("/jobs/getall", isEmployerAuthenticated, getJobs);
router.get("/jobs/:id/applications", isEmployerAuthenticated, trackApplicants);
router.put("/jobs/update/:id", isEmployerAuthenticated, updateJob);
router.delete("/jobs/delete/:id", isEmployerAuthenticated, deleteJob);
router.put("/jobs/application/update/:id", isEmployerAuthenticated, updateApplication);

export default router;
