import express from "express";
import { empLogin, empRegister } from "../controllers/empController.js";

const router = express.Router();

router.post("/register", empRegister);
router.post("/login", empLogin);

export default router;
