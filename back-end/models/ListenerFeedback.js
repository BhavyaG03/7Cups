const mongoose = require("mongoose");

const ListenerFeedbackSchema = new mongoose.Schema(
  {
    room_id: { type: String, required: true },
    listener_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    overall_experience: { type: Number, required: true, min: 1, max: 5 }, // ⭐⭐⭐⭐⭐
    
    speaker_behavior: { 
      type: String, 
      enum: ["Genuine", "Just passing time", "Inappropriate"], 
      required: true 
    },

    inappropriate_details: { type: String, default: "" } // Optional field for inappropriate feedback
  },
  { timestamps: true }
);

module.exports = mongoose.model("ListenerFeedback", ListenerFeedbackSchema);
