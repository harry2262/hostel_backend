import Hostel from "../models/hostel.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandlers.js";
import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import mongoose from "mongoose";
import Room from "../models/rooms.js";

export const  addHostel = catchAsyncErrors(async (req, res, next) => {
  let hostelData = {
    name: req.body.name,
    rooms: req.body.rooms,
  };
  let result = await Hostel.findOne({ name: hostelData.name });
  if (result) {
    console.log(result);
    return next(new ErrorHandler("hostel already exists", 400));
  }
  result = await Hostel.create(hostelData);
  if (!result) {
    return next(new ErrorHandler("hostel not added", 400));
  }

  res.status(200).json({
    success: true,
    message: "hostel added successfully",
  });
});

export const  updateHostel = catchAsyncErrors(async (req, res, next) => {
  let hostelData = {
    name: req.body.name,
    rooms: req.body.rooms,
  };

  let result = await Hostel.findOne({ name: hostelData.name });
  if (!result) {
    // console.log(result);
    return next(new ErrorHandler("hostel not found", 400));
  }

  result = await Hostel.findOneAndUpdate(
    { name: hostelData.name },
    { $push: { rooms: { $each: hostelData.rooms } } },
    { upsert: true, runValidators: true, new: true }
  );
  if (!result) {
    return next(new ErrorHandler("hostel not updated", 400));
  }

  res.status(200).json({
    success: true,
    message: "hostel updated successfully",
  });
});

export const  getHostel = catchAsyncErrors(async (req, res, next) => {

  const name = req.params.id;
  let result = await Hostel.findOne({ name: name });
  if (!result) {
    return next(new ErrorHandler("hostel not found", 400));
  }
  res.status(200).json({
    success: true,
    result,
  });
});
// export const  bookRoom = catchAsyncErrors(async (req, res, next) => {
//   // console.log("yes--");
//   const { studentId, hostelName, roomNumber } = req.body;

//   if (!studentId || !hostelName || !roomNumber) {
//     return next(new ErrorHandler("All fields are required", 400));
//   }

//   // Check if the user exists
//   let user = await User.findOne({ email: studentId });
//   if (!user) {
//     return next(new ErrorHandler("User not found", 400));
//   }

//   // Check if the hostel exists
//   let hostel = await Hostel.findOne({ name: hostelName });
//   if (!hostel) {
//     return next(new ErrorHandler("Hostel not found", 400));
//   }

//   // Check if the room exists and is empty
//   let room = await Room.findOne({ roomNumber: roomNumber });
//   if (!room) {
//     return next(new ErrorHandler("Room not found", 400));
//   }

//   if (room.occupants.length >= room.capacity) {
//     return next(new ErrorHandler("Room is already full", 400));
//   }

// if (user.hostel && user.roomNumber) {
//   return next(new ErrorHandler("User is already assigned to a room", 400));
// }

//   const isUserAlreadyInRoom = await Room.findOne({
//     roomNumber: roomNumber,
//     occupants: user._id,
//   });

//   if (isUserAlreadyInRoom) {
//     return next(new ErrorHandler("User is already in a room", 400));
//   }

//   // Add the studentId to the occupants array
//   room.occupants.push(user._id);

//   // Update user's hostel and roomNumber
//   user.hostel = hostel._id;
//   user.roomNumber = roomNumber;

//   // Save changes
//   await Promise.all([user.save(), room.save()]);

//   res.status(200).json({
//     success: true,
//     message: "Room booked successfully",
//   });
// });
export const  bookRoom = catchAsyncErrors(async (req, res, next) => {
  const { studentId, hostelName, roomNumber } = req.body;

  if (!studentId || !hostelName || !roomNumber) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user exists
    let user = await User.findOne({ email: studentId }).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("User not found", 400));
    }

    // Check if the hostel exists
    let hostel = await Hostel.findOne({ name: hostelName }).session(session);
    if (!hostel) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Hostel not found", 400));
    }

    // Check if the room exists and is empty
    let room = await Room.findOne({ roomNumber: roomNumber }).session(session);
    if (!room) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Room not found", 400));
    }

    if (room.occupants.length >= room.capacity) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Room is already full", 400));
    }

    if (user.hostel && user.roomNumber) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("User is already assigned to a room", 400));
    }

    const isUserAlreadyInRoom = await Room.findOne({
      roomNumber: roomNumber,
      occupants: user._id,
    }).session(session);

    if (isUserAlreadyInRoom) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("User is already in a room", 400));
    }

    // Add the studentId to the occupants array
    room.occupants.push(user._id);

    // Update user's hostel and roomNumber
    user.hostel = hostel._id;
    user.roomNumber = roomNumber;

    // Save changes within the transaction
    await Promise.all([user.save({ session }), room.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Room booked successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// export const  insertRooms = catchAsyncErrors(async (req, res, next) => {
//   const { hostel, start, end, capacity } = req.body;
//   if (!hostel || !start || !end || !capacity) {
//     return next(new ErrorHandler("all fields are required", 400));
//   }
//   let result = await Hostel.findOne({ name: hostel });
//   if (!result) {
//     return next(new ErrorHandler("hostel not found", 400));
//   }
//
//   const insertionPromises = [];
//
//   for (let i = start; i <= end; i++) {
//     insertionPromises.push(
//       Room.create({
//         roomNumber: i,
//         capacity: capacity,
//         hostel: result._id,
//       }),
//     );
//   }
//   const results = await Promise.all(insertionPromises);
//   if (!results) {
//     return next(new ErrorHandler("rooms not added", 400));
//   } else {
//     res.status(200).json({
//       success: true,
//       message: "rooms added successfully",
//     });
//   }
// });

// mongoose.connect("mongodb://localhost:27017/employees", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

export const  addHostelAndRooms = async (req, res, next) => {
  try {
    const mbhB = await Hostel.create({
      name: "MBH-B",
      roomCount: 322,
      floorCount: 7,
    });

    const totalRoomsPerFloor = 46;
    const totalFloors = 7;

    for (let floor = 1; floor <= totalFloors; floor++) {
      const startRoom = (floor) * 100 + 1;
      const endRoom = startRoom + totalRoomsPerFloor - 1;

      for (let roomNumber = startRoom; roomNumber <= endRoom; roomNumber++) {
        await Room.create({
          hostel: mbhB._id,
          roomNumber: roomNumber.toString(),
          capacity: 1, 
          occupants: [],
        });
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Hostel and rooms added successfully!" });
  } catch (error) {
    console.error("Error adding hostel and rooms:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to add hostel and rooms" });
  } 
};

export const  roomCounts = async (req, res) =>{
try {
    const totalRoomsPerFloor = 46; 
    const totalFloors = 7; 
    res.json({ totalRoomsPerFloor, totalFloors });
  } catch (error) {
    console.error("Error fetching room counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const  getBookedRooms = async (req, res) => {
  try {
    const bookedRooms = await Room.find({ occupants: { $ne: [] } }).select(
      "roomNumber"
    );
    res.json(bookedRooms);
  } catch (error) {
    console.error("Error fetching booked rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};