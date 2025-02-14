const Snap = require("../models/Snap");

// Create a new Snap
exports.createSnap = async (req, res) => {
  try {
    const { userId, listenerId, room_id } = req.body;

    if (!userId || !listenerId || !room_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSnap = new Snap({ userId, listenerId, room_id });
    await newSnap.save();

    res.status(201).json({ message: "Snap created successfully", snap: newSnap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all Snaps
exports.getAllSnaps = async (req, res) => {
  try {
    const snaps = await Snap.find().populate("userId listenerId");
    res.status(200).json(snaps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Snap by ID
exports.getSnapById = async (req, res) => {
  try {
    const snap = await Snap.findById(req.params.id).populate("userId listenerId");

    if (!snap) {
      return res.status(404).json({ message: "Snap not found" });
    }

    res.status(200).json(snap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Snap by ID
exports.deleteSnap = async (req, res) => {
  try {
    const snap = await Snap.findByIdAndDelete(req.params.id);

    if (!snap) {
      return res.status(404).json({ message: "Snap not found" });
    }

    res.status(200).json({ message: "Snap deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
