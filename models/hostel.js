import mongoose from "mongoose";
const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  roomCount: Number,
  floorCount: Number,
});

export default mongoose.model("Hostel", hostelSchema);
