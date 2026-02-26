import express from "express";
import {
  employerLogin,
  employerRegister,
} from "../controllers/employerController.js";
import { isEmployerAuthenticated } from "../middlewares/auth.js";
import {
  deleteJob,
  getJobs,      
  publishJob,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/register", employerRegister);
router.post("/login", employerLogin);
router.post("/jobs/publish", isEmployerAuthenticated, publishJob);
router.get("/jobs/getall", isEmployerAuthenticated, getJobs);
router.put("/jobs/update/:id", isEmployerAuthenticated, updateJob);
router.delete("/jobs/delete/:id", isEmployerAuthenticated, deleteJob);

export default router;
