const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'angry', 'anxious', 'excited', 'tired', 'other'],
    default: 'neutral',
  },
  prompt: {
    type: String,
  },
  streak: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
