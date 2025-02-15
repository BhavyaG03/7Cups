const mongoose = require("mongoose");

const UserFeedbackSchema = new mongoose.Schema(
  {
    room_id: { type: String, required: true },
    listener_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    overall_experience: { type: Number, required: true, min: 1, max: 5 },
    was_helpful: { type: Boolean, required: true },
    unhelpful_details: { type: String, default: "" } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserFeedback", UserFeedbackSchema);
