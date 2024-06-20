import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import errorMiddleware from "./middleWares/errors.js";
import hostelRoutes from "./routes/hostel.js";
import userRoutes from "./routes/user.js";
import otpRoutes from "./routes/otp.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// import all routes here
// app.post('/api/v1/user/register',(req,res)=>{
// console.log(req);
// res.json({name: 'jos'});
// })
app.use("/api/v1/otp/", otpRoutes);
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/hostel/", hostelRoutes);
// middleware to handle errors
app.use(errorMiddleware);

export default app;
