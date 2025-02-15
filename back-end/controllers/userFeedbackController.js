const Feedback = require("../models/UserFeedback");

// ✅ Submit Feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { room_id, listener_id, user_id, overall_experience, was_helpful, unhelpful_details } = req.body;

    if (!room_id || !listener_id || !user_id || overall_experience == null || was_helpful == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = new Feedback({
      room_id,
      listener_id,
      user_id,
      overall_experience,
      was_helpful,
      unhelpful_details: was_helpful ? "" : unhelpful_details
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Get Feedback for a Room
exports.getRoomFeedback = async (req, res) => {
  try {
    const { room_id } = req.params;
    const feedbacks = await Feedback.find({ room_id });

    if (!feedbacks.length) {
      return res.status(404).json({ error: "No feedback found for this room" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
