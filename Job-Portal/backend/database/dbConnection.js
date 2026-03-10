import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

export const dbConnection = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    throw new Error("Missing MONGO_URI environment variable");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "JOB_PORTAL",
    });
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Error while connecting to database:", err.message);
    throw err;
  }
};
