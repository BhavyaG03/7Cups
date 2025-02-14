const Room = require("../models/Room");

// 📌 Create a Room
exports.createRoom = async (req, res) => {
  try {
    const { room_id, listener_id } = req.body;
   const room = new Room({ room_id, listener_id, user_id: null });
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


// 📌 Update Room
exports.updateRoom = async (req, res) => {
  try {
    const { user_id, listener_id } = req.body;
    const { room_id } = req.params;  // Get room_id from URL

    // Construct update object dynamically
    const updateFields = {};
    if (user_id) updateFields.user_id = user_id;
    if (listener_id) updateFields.listener_id = listener_id;

    const room = await Room.findOneAndUpdate(
      { room_id },
      { $set: updateFields },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



// 📌 Get Room by ID
exports.getRoom = async (req, res) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findOne({ room_id });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📌 Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 📌 Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findOneAndDelete({ room_id });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
