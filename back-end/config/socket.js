const socketIo = require("socket.io");
const Message = require("../models/Message");
const profanity = require("profanity-hindi");
const User = require("../models/User");
const { messageStorage } = require("./redis");

let usersInRoom = {};

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
    transports: ['websocket'], // Force WebSocket
    pingTimeout: 30000, // 30 seconds (reduced)
    pingInterval: 10000, // 10 seconds (reduced)
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true,
    connectTimeout: 20000, // 20 seconds
    upgradeTimeout: 10000, // 10 seconds
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

    socket.on("join_room", async (data) => {
      // Accept both string (room) and object ({ room, userId })
      let room, userId;
      if (typeof data === 'string') {
        room = data;
        userId = socket.userId || null;
      } else {
        room = data.room;
        userId = data.userId || socket.userId || null;
      }
      console.log("[SOCKET] join_room called for room:", room, "userId:", userId, "socketId:", socket.id, "Current users before:", usersInRoom[room]);
      if (usersInRoom[room] && usersInRoom[room].length >= 2) {
        console.log("[SOCKET] Room full for room:", room, "userId:", userId, "socketId:", socket.id, "Current users:", usersInRoom[room]);
        socket.emit("room_full", { message: "This room is full. You cannot join." });
        return;
      }

      socket.join(room);
      usersInRoom[room] = usersInRoom[room] || [];
      if (!usersInRoom[room].includes(socket.id)) {
        usersInRoom[room].push(socket.id);
      }
      console.log("[SOCKET] User joined room:", room, "userId:", userId, "socketId:", socket.id, "Current users after:", usersInRoom[room]);
      io.to(room).emit("user_joined", { userId: socket.id });
      
      // Fetch and send existing messages from Redis
      try {
        const messages = await messageStorage.getMessages(room);
        if (messages.length > 0) {
          socket.emit("load_messages", messages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
      
      // Debug: Show all users in the room after join
      console.log(`[SOCKET] Users in room ${room}:`, usersInRoom[room]);
    });

    socket.on("send_message", async (msgData) => {
      const startTime = Date.now();
      
      if (!usersInRoom[msgData.room] || !usersInRoom[msgData.room].includes(socket.id)) {
        socket.emit("error_message", { error: "You are not in this room to send a message." });
        return;
      }

      // Debug: Log the message data to understand what's being sent
      console.log("Message data received:", typeof msgData.message, msgData.message);
      
      // Censor profanities in the message
      // Ensure message is a string before processing
      if (msgData.message && typeof msgData.message === 'string' && msgData.message.trim() !== '') {
        try {
          msgData.message = profanity.maskBadWords(msgData.message);
        } catch (error) {
          console.error("Profanity filter error:", error);
          console.log("Message that caused error:", msgData.message, typeof msgData.message);
          // Continue without profanity filtering if there's an error
        }
      } else {
        // If message is not a valid string, reject it
        console.log("Invalid message format:", msgData.message, typeof msgData.message);
        socket.emit("error_message", { error: "Invalid message format." });
        return;
      }

      // Store the message in Redis for session persistence
      try {
        await messageStorage.storeMessage(msgData.room, msgData);
        io.to(msgData.room).emit("receive_message", msgData);
        const endTime = Date.now();
        console.log(`[PERF] Message sent in ${endTime - startTime}ms`);
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
      const startTime = Date.now();
      socket.to(room).emit("user_typing", { userName });
      const endTime = Date.now();
      console.log(`[PERF] Typing indicator sent in ${endTime - startTime}ms`);
    });
    

    // ✅ Handle chat end
    socket.on("chatEnded", async ({ room_id, listener_id, user_id, user_role }) => {
      console.log(`Chat ended in room: ${room_id}`);
      io.to(room_id).emit("chatEnded", { room_id, listener_id, user_id, user_role });

      // Clear messages from Redis when chat ends
      try {
        await messageStorage.clearMessages(room_id);
      } catch (error) {
        console.error("Error clearing messages:", error);
      }

      // Remove the room from tracking
      delete usersInRoom[room_id];
    });

    // ✅ Handle user disconnection and remove them from rooms
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      // Set user offline and update lastSeen, and clear room_id
      if (socket.userId) {
        try {
          await User.findByIdAndUpdate(socket.userId, { status: "offline", room_id: null, lastSeen: new Date() });
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
