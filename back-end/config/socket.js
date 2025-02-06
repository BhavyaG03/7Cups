const socketIo = require("socket.io");
const Message = require("../models/Message");

let usersInRoom = {}; // Format: { roomName: [socket.id, ...] }

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (room) => {
      if (usersInRoom[room] && usersInRoom[room].length >= 2) {
        socket.emit("room_full", { message: "This room is full. You cannot join." });
        return;
      }

      socket.join(room);
      console.log(`User with ID: ${socket.id} joined room: ${room}`);

      usersInRoom[room] = usersInRoom[room] || [];
      usersInRoom[room].push(socket.id);

      io.to(room).emit("user_joined", { userId: socket.id });
    });

    socket.on("send_message", async (msgData) => {
      if (!usersInRoom[msgData.room] || !usersInRoom[msgData.room].includes(socket.id)) {
        socket.emit("error_message", { error: "You are not in this room to send a message." });
        return;
      }

      try {
        const newMessage = new Message({
          room: msgData.room,
          author: msgData.author,
          message: msgData.message,
          time: msgData.time,
        });
        await newMessage.save();

        io.to(msgData.room).emit("receive_message", {
          room: msgData.room,
          author: msgData.author,
          message: msgData.message,
          time: msgData.time,
        });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error_message", { error: "Failed to save the message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (let room in usersInRoom) {
        usersInRoom[room] = usersInRoom[room].filter((id) => id !== socket.id);
        if (usersInRoom[room].length === 0) {
          delete usersInRoom[room];
        }
      }

      io.emit("user_left", { userId: socket.id });
    });
  });
};

module.exports = { initSocket };
