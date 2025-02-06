const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/messages", async (req, res) => {
  const { room } = req.query;
  try {
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = app;
