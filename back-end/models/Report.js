const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    room_id: { type: String, required: true },
    reported_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    reported_person: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    reason: {
      type: String,
      enum: [
        "Inappropriate language or behavior",
        "Harassment or abuse",
        "Unrelated or irrelevant conversation",
        "Spam or disruptive behavior",
        "Other"
      ],
      required: true
    },
    description: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Reviewed", "Blocked"], default: "Pending" } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
