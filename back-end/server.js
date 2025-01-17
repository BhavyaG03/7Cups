const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== SOCKET.IO SETUP =====
const io = new Server(server, {
  cors: {
    origin: '*', // Or list of allowed origins
    methods: ['GET', 'POST'],
  },
});

// Whenever a new client connects
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listening for chat messages
  socket.on('send_message', (data) => {
    // Broadcast the message to all users in the room
    io.to(data.room).emit('receive_message', data);
  });

  // Join a chat room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ===== MONGO CONNECTION =====
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => console.log(err));

// ===== ROUTES =====
const authRoutes = require('./routes/authRoutes');
const forumRoutes = require('./routes/forumRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
