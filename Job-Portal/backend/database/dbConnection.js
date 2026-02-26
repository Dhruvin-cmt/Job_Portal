import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "JOB_PORTAL",
    })
    .then(() => {
      console.log("Database conncted succesfully!");
    })
    .catch((err) => {
      console.log("Something went wrong while connecting database", err);
    });
};
