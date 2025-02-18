const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Controller function to delete all messages
const deleteAllMessages = async (req, res) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ message: "All messages deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete messages." });
  }
};

// Define the DELETE route
router.delete("/api/delete", deleteAllMessages);

module.exports = router;
