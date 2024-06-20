import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandlers.js";
import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import OTP from "../models/otp.js";
import Room from "../models/rooms.js";
import Hostel from "../models/hostel.js";
import sendTimedEmail from "../utils/sendTimedEmail.js";
import { sendOTP } from "./otpController.js";

// For cloudinary.v2, you need to use named imports as follows
const { v2: cloudinaryV2 } = cloudinary;

// Register a user     => /api/v1/register
export const  registerUser = catchAsyncErrors(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    // otp: req.body.otp,
  };
  if (newUserData.email) {
    const tempUser = await User.findOne({ email: newUserData.email });
    if (tempUser) {
      return next(new ErrorHandler("User id already exists", 400));
    }
  }
  // const response = await OTP.find({ email: newUserData.email })
  //   .sort({ createdAt: -1 })
  //   .limit(1);
  // if (response.length === 0 || newUserData.otp !== response[0].otp) {
  //   return next(new ErrorHandler("otp not valid", 400));
  // }
  const user = await User.create(newUserData);
  sendToken(user, 200, res);
  await sendOTP(req, res, next);
});

// Login user     => /api/v1/login
export const  loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password are entered or not
  if (!email) {
    return next(new ErrorHandler("Please enter user id", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Please enter password", 400));
  }

  const user = await User.findOne({ email : email});
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
//    console.log(user.password);
//   const isPasswordMatched = await User.comparePassword(password);
//  console.log(isPasswordMatched);
if (user) {
  const isPasswordMatched = await user.comparePassword(password);
  if (isPasswordMatched) {
    console.log("success");
    sendToken(user, 200, res);
  } 
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Id or Password", 401));
  }
    // Password doesn't match
} 
});

// Get currently logged in user details     =>  /api/v1/me
// Logout user         =>     /api/v1/logout
export const  logout = catchAsyncErrors(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logged out !!",
  });
});

export const  bookRoom = catchAsyncErrors(async (req, res, next) => {
  const { studentCount, studentIds, hostel, roomNumber } = req.body;
  if (!studentCount || !studentIds || !hostel || !roomNumber) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  const hostelid = await Hostel.findOne({ name: hostel });
  if (!hostelid) {
    return next(new ErrorHandler("Hostel not found", 400));
  }
  console.log(hostelid);
  if (hostelid.roomCount < roomNumber) {
    return next(new ErrorHandler("Room not found", 400));
  }

  const room = Room.findOne({ hostel, roomNumber });
  if (!room) {
    return next(new ErrorHandler("Room not found", 400));
  }
  if (room.capacity < studentCount) {
    return next(new ErrorHandler("Room is full", 400));
  }
  const response = await Room.updateOne(
    { roomNumber },
    { $push: { occupants: { $each: studentIds } } },
  );
  res.status(200).json({
    success: true,
    message: "Room booked successfully",
  });
});
export const  sendEmail = catchAsyncErrors(async (req, res, next) => {
  const { to } = req.body;
  const mailResponse = await sendTimedEmail({ email: to });
  res.status(200).json({
    success: true,
    message: "Email sent successfully",
    mailResponse,
  });
});
