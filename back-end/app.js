const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message");
const snapRoutes = require("./routes/snapRoutes");
const roomRoutes =require("./routes/roomRoutes");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/users", authRoutes);
app.use("/api/snaps", snapRoutes);
app.use("/api/chats", roomRoutes);



module.exports = app;
