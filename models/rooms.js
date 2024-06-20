import mongoose from "mongoose";
import Hostel from "./hostel.js";
import User from "./user.js";

const roomSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Hostel,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  occupants: [
    {
      type: String,
      ref: User,
    },
  ],
});
export default mongoose.model("Room", roomSchema);
