const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const Message = require('./models/Message');
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: 'https://calmify-y7tl.onrender.com',
    methods: ['GET', 'POST'],
  },
});

// Track users in rooms
let usersInRoom = {}; // Format: { roomName: [socket.id, ...] }

// When a new client connects
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a room
  socket.on('join_room', (room) => {
    // Check if the room exists and if it's full
    if (usersInRoom[room] && usersInRoom[room].length >= 2) {
      socket.emit("room_full", { message: "This room is full. You cannot join." });
      return;
    }

    // Ensure room exists before pushing socket.id
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);

    // Track users in the room
    usersInRoom[room] = usersInRoom[room] || [];
    usersInRoom[room].push(socket.id);

    // Optional: Notify other users in the room
    io.to(room).emit('user_joined', { userId: socket.id });
  });

  // Handle sending a message
  socket.on('send_message', async (msgData) => {
    // Prevent users from sending messages if they're not in the room
    if (!usersInRoom[msgData.room] || !usersInRoom[msgData.room].includes(socket.id)) {
      socket.emit('error_message', { error: 'You are not in this room to send a message.' });
      return;
    }

    try {
      // Save the message to the database
      const newMessage = new Message({
        room: msgData.room,
        author: msgData.author,
        message: msgData.message,
        time: msgData.time,
      });
      await newMessage.save();

      // Broadcast the message to the same room
      io.to(msgData.room).emit('receive_message', {
        room: msgData.room,
        author: msgData.author,
        message: msgData.message,
        time: msgData.time,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error_message', { error: 'Failed to save the message' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the user from the rooms they were in
    for (let room in usersInRoom) {
      usersInRoom[room] = usersInRoom[room].filter((id) => id !== socket.id);
      if (usersInRoom[room].length === 0) {
        delete usersInRoom[room]; // Remove the room if no users are left
      }
    }

    // Optional: Notify other users about the disconnect
    io.emit('user_left', { userId: socket.id });
  });
});

app.get('/messages', async (req, res) => {
  const { room } = req.query;
  try {
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
