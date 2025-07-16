const Journal = require('../models/Journal');

// Create a new journal entry
exports.createJournal = async (req, res) => {
  try {
    const { userId, text, mood, prompt, date } = req.body;
    if (!userId || !text || !date) {
      return res.status(400).json({ message: 'User ID, text and date are required.' });
    }
    // Check if entry for this date already exists for user
    const existing = await Journal.findOne({ userId, date: new Date(date).setHours(0,0,0,0) });
    if (existing) {
      return res.status(409).json({ message: 'Entry for this date already exists.' });
    }
    // Calculate streak
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const prev = await Journal.findOne({ userId, date: yesterday.setHours(0,0,0,0) });
    let streak = 1;
    if (prev) streak = prev.streak + 1;
    const entry = new Journal({ userId, text, mood, prompt, date: new Date(date).setHours(0,0,0,0), streak });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all journal entries for a user
exports.getJournals = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const entries = await Journal.find({ userId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a journal entry by date for a user
exports.getJournalByDate = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;
    const { date } = req.params;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const entry = await Journal.findOne({ userId, date: new Date(date).setHours(0,0,0,0) });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a journal entry by id for a user
exports.updateJournal = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    const { text, mood, prompt } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const entry = await Journal.findOneAndUpdate(
      { _id: id, userId },
      { text, mood, prompt },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a journal entry by id for a user
exports.deleteJournal = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { id } = req.params;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const entry = await Journal.findOneAndDelete({ _id: id, userId });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get current streak for a user
exports.getStreak = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const latest = await Journal.findOne({ userId }).sort({ date: -1 });
    res.status(200).json({ streak: latest ? latest.streak : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
