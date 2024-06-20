import express from "express";
import {
  addHostel,
  updateHostel,
  getHostel,
  bookRoom,
  addHostelAndRooms,
  roomCounts,
  getBookedRooms,
  // insertRooms,
} from "../controllers/hostel.js";

const router = express.Router();


router.route("/addHostel").post(addHostel);
router.route("/updateHostel").patch(updateHostel);
router.route("/:id").get(getHostel);
router.route("/bookRoom").post(bookRoom);
router.route("/addhostelandrooms").post(addHostelAndRooms);
router.route("/:hostelName/roomCounts").get(roomCounts);
router.route("/:hostelName/getBookedRooms").get(getBookedRooms);
export default router;
