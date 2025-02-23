const Report = require("../models/Report");

exports.submitReport = async (req, res) => {
  try {
    const { room_id, reported_by, reported_person, reason, description } = req.body;

    if (!room_id || !reported_by || !reported_person || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const report = new Report({
      room_id,
      reported_by,
      reported_person,
      reason,
      description: reason === "Other" ? description : ""
    });

    await report.save();
    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get all reports (For Admin)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reported_by reported_person", "name email");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Block a user (Admin Action)
exports.blockUser = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "Blocked";
    await report.save();

    // TODO: Implement actual user blocking logic (e.g., update User model)

    res.status(200).json({ message: "User blocked successfully", report });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
exports.deleteAll = async (req, res) => {
  try {
    const report = await Report.deleteMany();

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
