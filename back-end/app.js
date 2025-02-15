const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message");
const snapRoutes = require("./routes/snapRoutes");
const roomRoutes =require("./routes/roomRoutes");
const userFeedbackRoutes=require("./routes/userFeedbackRoutes");
const listenerFeedbackRoutes=require("./routes/listenerFeedbackroutes");
const reportRoutes = require("./routes/reportRoutes");
const questionRoutes = require("./routes/questionRoutes");


const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/users", authRoutes);
app.use("/api/snaps", snapRoutes);
app.use("/api/chats", roomRoutes);
app.use("/api/user/feedback", userFeedbackRoutes);
app.use("/api/listener/feedback", listenerFeedbackRoutes);
app.use("/api/responses", questionRoutes);
app.use("/api/reports", reportRoutes);





module.exports = app;
