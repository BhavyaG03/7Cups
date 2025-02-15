const Question = require("../models/Question");

// Save user responses
const saveResponses = async (req, res) => {
  try {
    const { userId, responses, additionalNotes } = req.body;
    console.log("Received body:", req.body);

    if (!userId || !responses) {
      return res.status(400).json({ message: "User ID and responses are required." });
    }

    const newResponse = new Question({
      userId,
      responses,
      additionalNotes,
    });

    await newResponse.save();
    res.status(201).json({ message: "Responses saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get responses for a user
const getUserResponses = async (req, res) => {
  try {
    const { userId } = req.params;
    const responses = await Question.findOne({ userId });

    if (!responses) {
      return res.status(404).json({ message: "No responses found" });
    }

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { saveResponses, getUserResponses };
