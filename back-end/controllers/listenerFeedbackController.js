const ListenerFeedback = require("../models/ListenerFeedback");

// ✅ Submit Listener Feedback
exports.submitListenerFeedback = async (req, res) => {
  try {
    const { room_id, listener_id, user_id, overall_experience, speaker_behavior, inappropriate_details } = req.body;

    if (!room_id || !listener_id || !user_id || overall_experience == null || !speaker_behavior) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = new ListenerFeedback({
      room_id,
      listener_id,
      user_id,
      overall_experience,
      speaker_behavior,
      inappropriate_details: speaker_behavior === "Inappropriate" ? inappropriate_details : "" // Only store if inappropriate
    });

    await feedback.save();
    res.status(201).json({ message: "Listener feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Get Feedback for a Room
exports.getListenerFeedbackForRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    const feedbacks = await ListenerFeedback.find({ room_id });

    if (!feedbacks.length) {
      return res.status(404).json({ error: "No feedback found for this room" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
exports.deleteAll = async (req, res) => {
  try {
    const feedbacks = await ListenerFeedback.deleteMany();

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};