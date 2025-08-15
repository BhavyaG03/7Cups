const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "listener"],
      required:true
    },
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
      required: true
    },
    isConnected: {
      type: Boolean,
      default: false
    },
    lastSeen: {
      type: Date,
      default: null
    },
    room_id:{
      type: String,
      default:null
    },
    rating:{
      type:Number,
    },
    total_ratings:{
      type:Number
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      default: null
    },
    emailVerificationExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
