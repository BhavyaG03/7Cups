const Message = require("../models/Message");
const { messageStorage } = require('../config/redis');

// Get messages for a room
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await messageStorage.getMessages(roomId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Clear messages for a room
const clearMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    await messageStorage.clearMessages(roomId);
    res.json({ message: 'Messages cleared successfully' });
  } catch (error) {
    console.error('Error clearing messages:', error);
    res.status(500).json({ error: 'Failed to clear messages' });
  }
};

module.exports = {
  getMessages,
  clearMessages
};
