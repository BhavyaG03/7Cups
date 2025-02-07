const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", authRoutes);

module.exports = app;
