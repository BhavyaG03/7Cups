const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: 'https://calmify-y7tl.onrender.com', // Frontend URL
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'https://calmify-y7tl.onrender.com' }));

let usersInRoom = {};  // Store users by room name

// When a new client connects
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a room
  socket.on('join_room', (room) => {
    socket.join(room);  // Join the specified room
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
    usersInRoom[room] = usersInRoom[room] || [];
    usersInRoom[room].push(socket.id);
  });

  // Handle receiving a message
  socket.on('send_message', (msgData) => {
    console.log('Message from user:', msgData);
    io.to(msgData.room).emit('receive_message', msgData);  // Broadcast message to the same room
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from rooms on disconnect
    for (let room in usersInRoom) {
      usersInRoom[room] = usersInRoom[room].filter(id => id !== socket.id);
      if (usersInRoom[room].length === 0) {
        delete usersInRoom[room];
      }
    }
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
