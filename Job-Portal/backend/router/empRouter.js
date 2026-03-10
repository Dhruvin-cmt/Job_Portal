import express from "express";
import multer from "multer";
import {
  empLogin,
  empRegister,
  empLogout,
  empMe,
  myApplications,
  uploadResume,
} from "../controllers/empController.js";
import { applyToJob } from "../controllers/applicationController.js"
import { isEmpAuthenticated } from "../middlewares/auth.js";

export const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post("/register", empRegister);
router.post("/login", empLogin);
router.get("/me", isEmpAuthenticated, empMe);
router.post("/logout", isEmpAuthenticated, empLogout);
router.post(
  "/upload",
  isEmpAuthenticated,
  upload.single("resume"),
  uploadResume
);
router.post(
  "/jobs/apply/:id",
  isEmpAuthenticated,
  upload.single("resume"),
  applyToJob
);
router.get("/jobs/myapplications", isEmpAuthenticated, myApplications)

export default router;
