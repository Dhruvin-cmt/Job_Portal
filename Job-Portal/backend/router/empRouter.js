import express from "express";
import multer from "multer";
import {
  empLogin,
  empRegister,
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

export default router;
