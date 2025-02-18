const socketIo = require("socket.io");
const Message = require("../models/Message");

let usersInRoom = {};

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
       // Store the message in the database
       try {
        const newMessage = new Message(msgData);
        await newMessage.save();
        io.to(msgData.room).emit("receive_message", msgData);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // ✅ Handle SOS alert
    socket.on("sos", ({ room_id, listener_id, user_id }) => {
      console.log(`SOS triggered in room: ${room_id} by user ${user_id || listener_id}`);

      if (usersInRoom[room_id]) {
        // Broadcast SOS event to the room
        io.to(room_id).emit("sos", { room_id, listener_id, user_id });
      }
    });
    // ✅ Handle report alert
    socket.on("report", ({ room_id, reported_by, reported_person }) => {
      console.log(`Report triggered in room: ${room_id} by user ${reported_by} against ${reported_person}`);
    
      if (usersInRoom[room_id]) {
        // Broadcast report event to the room with correct properties
        io.to(room_id).emit("report", { room_id, reported_by, reported_person });
      }
    });
    

    // ✅ Handle chat end and notify both users
    socket.on("chatEnded", ({ room_id, listener_id, user_id }) => {
      console.log(`Chat ended, broadcasting to room: ${room_id}`);

      if (usersInRoom[room_id]) {
        io.to(room_id).emit("chatEnded", { room_id, listener_id, user_id });

        // Optionally, clear the room from tracking
        delete usersInRoom[room_id];
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
