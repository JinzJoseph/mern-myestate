import express from "express";
import connectDB from "./config/db.js"; // Assuming db.js is located in the config folder

const app = express();
connectDB();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
