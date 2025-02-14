const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  room_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  listener_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
}, { timestamps: true });

module.exports = mongoose.model("Room", RoomSchema);