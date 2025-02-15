const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  additionalNotes: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
