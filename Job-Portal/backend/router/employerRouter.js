import express from "express";
import { employerLogin, employerRegister } from "../controllers/employerController.js";

const router = express.Router();

router.post("/register", employerRegister);
router.post("/login", employerLogin);

export default router;
