import express from "express";
import connectDB from "./config/db.js"; // Assuming db.js is located in the config folder
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js"
import bodyParser from "body-parser";
const app = express();

connectDB();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use(bodyParser.json())
app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)