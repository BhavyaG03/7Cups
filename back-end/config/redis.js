const redis = require('redis');

// Create Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis with better error handling
let isRedisConnected = false;
client.connect().then(() => {
  console.log('Connected to Redis Cloud');
  isRedisConnected = true;
}).catch((err) => {
  console.log('Redis connection failed, using fallback storage');
  console.log('Make sure REDIS_URL is set in your .env file');
  isRedisConnected = false;
});

// Handle connection events
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// In-memory fallback storage
const inMemoryStorage = new Map();

// Message storage functions
const messageStorage = {
  // Store a message for a room (expires in 24 hours)
  async storeMessage(roomId, message) {
    const startTime = Date.now();
    try {
      if (isRedisConnected) {
        const key = `messages:${roomId}`;
        await client.lPush(key, JSON.stringify(message));
        // Set expiration to 24 hours
        await client.expire(key, 24 * 60 * 60);
        const endTime = Date.now();
        console.log(`[REDIS] Message stored in ${endTime - startTime}ms`);
      } else {
        // Fallback to in-memory storage
        if (!inMemoryStorage.has(roomId)) {
          inMemoryStorage.set(roomId, []);
        }
        inMemoryStorage.get(roomId).push(message);
      }
      return true;
    } catch (error) {
      console.error("Error storing message:", error);
      return false;
    }
  },

  // Get all messages for a room
  async getMessages(roomId) {
    try {
      if (isRedisConnected) {
        const key = `messages:${roomId}`;
        const messages = await client.lRange(key, 0, -1);
        // Reverse the messages to get oldest first (chronological order)
        return messages.map(msg => JSON.parse(msg)).reverse();
      } else {
        // Fallback to in-memory storage
        return inMemoryStorage.get(roomId) || [];
      }
    } catch (error) {
      console.error("Error getting messages:", error);
      return inMemoryStorage.get(roomId) || [];
    }
  },

  // Clear messages for a room (when chat ends)
  async clearMessages(roomId) {
    try {
      if (isRedisConnected) {
        const key = `messages:${roomId}`;
        await client.del(key);
      } else {
        // Fallback to in-memory storage
        inMemoryStorage.delete(roomId);
      }
      return true;
    } catch (error) {
      console.error("Error clearing messages:", error);
      return false;
    }
  },

  // Get room info (user count, etc.)
  async getRoomInfo(roomId) {
    try {
      if (isRedisConnected) {
        const key = `room:${roomId}`;
        const info = await client.hGetAll(key);
        return info;
      } else {
        return {};
      }
    } catch (error) {
      console.error("Error getting room info:", error);
      return {};
    }
  },

  // Set room info
  async setRoomInfo(roomId, info) {
    try {
      if (isRedisConnected) {
        const key = `room:${roomId}`;
        await client.hSet(key, info);
        // Set expiration to 24 hours
        await client.expire(key, 24 * 60 * 60);
      }
      return true;
    } catch (error) {
      console.error("Error setting room info:", error);
      return false;
    }
  }
};

module.exports = { client, messageStorage }; 