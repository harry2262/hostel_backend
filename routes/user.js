import express from "express";
import {
  registerUser,
  loginUser,
  // getUserProfile,
 // updateUserProfile,
 // getFilteredUsers,
  logout,
  bookRoom,
  sendEmail,
} from "../controllers/user.js";

import { isAuthenticatedUser } from "../middleWares/auth.js";

const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
// router.route("/me").get(isAuthenticatedUser, getUserProfile);
// router.route("/filtered-users").post(isAuthenticatedUser, getFilteredUsers);
// router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
// router.route("/logout").get(logout);
router.route("/test").get(async (req, res) => {
  // const newsubject = await subject.create({
  //   dsapages: [],
  //   languagepages: [],
  //   csfundamentalspages: [],
  //   projectpages: [],
  // });
  res.status(200).json({
    success: true,
    message:
      "Welcome to the API, this is test route, Server running successfully !!",
  });
});
router.route("/bookRoom").post(bookRoom);
router.route("/sendEmail").post(sendEmail);
export default router;
