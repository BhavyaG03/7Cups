const express = require('express');
const router = express.Router();
const { getMessages, clearMessages } = require('../controllers/messageController');

// Get messages for a room
router.get('/:roomId', getMessages);

// Clear messages for a room
router.delete('/:roomId', clearMessages);

module.exports = router; 