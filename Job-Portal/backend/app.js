import express from "express";
// import multer from "multer";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import empRouter from "./router/empRouter.js";
import employerRouter from "./router/employerRouter.js";
import { getPublicJobs } from "./controllers/jobController.js";
import { errorMiddleware } from "./middlewares/error.js";

config({ path: "./config/.env" });

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user/emp", empRouter);
app.use("/api/user/employer", employerRouter);
app.get("/api/jobs", getPublicJobs);

app.use(errorMiddleware);

export default app;
