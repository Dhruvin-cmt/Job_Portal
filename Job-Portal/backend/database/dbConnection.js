import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.DATABASE_NAME, {
        dbName: "JOB_PORTAL"
    })
    .then(() => {
      console.log("Database conncted succesfully!");
    })
    .catch((err) => {
      console.log("Something went wrong while connecting database", err);
    });
};
