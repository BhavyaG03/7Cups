const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { initSocket } = require("./config/socket");
require("dotenv").config();

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
