const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["online", "offline"],
      default: "offline",
      required: true
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
