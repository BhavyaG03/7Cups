const socketIo = require("socket.io");
const Message = require("../models/Message");
const profanity = require("profanity-hindi");
const User = require("../models/User"); // <-- Import User model

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

    // Expect user to send their userId after connecting
    socket.on("user_online", async (userId) => {
      socket.userId = userId;
      try {
        await User.findByIdAndUpdate(userId, { status: "online", lastSeen: null });
      } catch (err) {
        console.error("Error setting user online:", err);
      }
    });

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

      // Censor profanities in the message
      msgData.message = profanity.maskBadWords(msgData.message);

      // Store the message in the database
      try {
        const newMessage = new Message(msgData);
        io.to(msgData.room).emit("receive_message", msgData);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // ✅ Handle SOS alert
    socket.on("sos", ({ room_id, listener_id, user_id }) => {
      console.log(`SOS triggered in room: ${room_id} by user ${user_id || listener_id}`);
      io.to(room_id).emit("sos", { room_id, listener_id, user_id });
    });

    // ✅ Handle report alert
    socket.on("report", ({ room_id, reported_by, reported_person }) => {
      console.log(`Report triggered in room: ${room_id} by user ${reported_by} against ${reported_person}`);
      io.to(room_id).emit("report", { room_id, reported_by, reported_person });
    });
    socket.on("user_typing", ({ room, userName }) => {
      socket.to(room).emit("user_typing", { userName });
    });
    

    // ✅ Handle chat end
    socket.on("chatEnded", ({ room_id, listener_id, user_id, user_role }) => {
      console.log(`Chat ended in room: ${room_id}`);
      io.to(room_id).emit("chatEnded", { room_id, listener_id, user_id, user_role });

      // Remove the room from tracking
      delete usersInRoom[room_id];
    });

    // ✅ Handle user disconnection and remove them from rooms
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      // Set user offline and update lastSeen
      if (socket.userId) {
        try {
          await User.findByIdAndUpdate(socket.userId, { status: "offline", lastSeen: new Date() });
        } catch (err) {
          console.error("Error setting user offline:", err);
        }
      }
      for (let room in usersInRoom) {
        if (usersInRoom[room].includes(socket.id)) {
          usersInRoom[room] = usersInRoom[room].filter((id) => id !== socket.id);

          // Emit user left event to the specific room
          io.to(room).emit("user_left", { userId: socket.id });

          // If room is empty, delete it
          if (usersInRoom[room].length === 0) {
            delete usersInRoom[room];
          }
        }
      }
    });
  });
};

module.exports = { initSocket };
