import express from "express";
import connectDB from "./config/db.js"; // Assuming db.js is located in the config folder
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js"
import bodyParser from "body-parser";
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
const app = express();



app.listen(3000, () => {
  console.log("server is running on port 3000");
});
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json())
dotenv.config()
connectDB();

app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)

app.use((err,req,res,next)=>{
const statusCode=err.statusCode || 500
const message=err.message || "internal server error"
return res.status(statusCode).json({
  success:false,
  statusCode:statusCode,
  message
})
})