# Redis Setup for Message Persistence

This implementation uses Redis for session-based message storage, providing message persistence during chat sessions without permanent storage.

## Features

- **Session-based persistence**: Messages are stored in Redis and expire after 24 hours
- **Privacy-friendly**: No permanent message storage in database
- **Automatic cleanup**: Messages are cleared when chat ends
- **Fallback mechanism**: API endpoint available if socket connection fails

## Setup

### 1. Install Redis

**On Windows:**
```bash
# Using WSL2 (recommended)
wsl --install
# Then in WSL:
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Linux:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

### 2. Environment Variables

Add to your `.env` file:
```
REDIS_URL=redis://localhost:6379
```

### 3. Install Dependencies

```bash
cd back-end
npm install redis
```

## How It Works

### Message Storage
- Messages are stored in Redis with key format: `messages:{roomId}`
- Each message is stored as a JSON string in a Redis list
- Messages expire after 24 hours automatically

### Message Retrieval
- When a user joins a room, existing messages are fetched from Redis
- Messages are sent to the client via socket.io `load_messages` event
- Fallback API endpoint available at `/api/messages/:roomId`

### Message Cleanup
- Messages are automatically cleared when chat ends
- Redis keys expire after 24 hours for privacy

## API Endpoints

- `GET /api/messages/:roomId` - Get messages for a room
- `DELETE /api/messages/:roomId` - Clear messages for a room

## Socket Events

- `join_room` - Join a room and receive existing messages
- `send_message` - Send a message (stored in Redis)
- `load_messages` - Receive existing messages when joining
- `chatEnded` - Clear messages when chat ends

## Privacy Features

- Messages are only stored in memory (Redis)
- Automatic expiration after 24 hours
- Messages cleared when chat ends
- No permanent database storage
- Fallback API for reliability

## Testing

1. Start Redis server
2. Start your backend server
3. Join a chat room
4. Send messages
5. Reload the page - messages should persist
6. End chat - messages should be cleared 