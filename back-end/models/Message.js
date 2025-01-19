const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: String,
  author: String,
  message: String,
  time: String,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
