const express = require('express');
const { createRoom, updateRoom, getRoom, deleteRoom, getRooms } = require('../controllers/roomController');

const router = express.Router();

router.post("/", createRoom);
router.put("/:room_id", updateRoom);
router.get("/:room_id", getRoom);
router.get("/", getRooms);
router.delete("/:room_id", deleteRoom);

module.exports= router;
