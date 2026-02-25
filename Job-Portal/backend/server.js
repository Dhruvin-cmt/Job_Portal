import mongoose from "mongoose";
import app from "./app.js";

app.listen(process.env.PORT, () => {
    console.log("App is listerning on :", process.env.PORT)
})
