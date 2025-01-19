import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Initialize the socket connection
const socket = io('http://localhost:5000');

function ChatPage() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [room, setRoom] = useState('general');  // Keep 'general' as default room
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [userId, setUserId] = useState(null);  // Unique ID for the session
  const [username, setUsername] = useState('Anonymous'); // Username from token or default

  useEffect(() => {
    // Generate a unique ID for this session
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    setUserId(uniqueId);

    // Decode JWT to extract the username
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Payload = token.split('.')[1]; // Extract the payload part
        const decodedPayload = JSON.parse(atob(base64Payload)); // Decode Base64 and parse JSON
        setUsername(decodedPayload?.username || 'Anonymous');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Join the room
    socket.emit('join_room', room);

    const handleReceiveMessage = (data) => {
      setMessageList((list) =>
        list.some((msg) => msg.time === data.time && msg.author === data.author)
          ? list
          : [...list, data]
      );
    };

    // Listen for messages
    socket.on('receive_message', handleReceiveMessage);

    // Clean up the listener on unmount or room change
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [room]);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const msgData = {
        room,
        author: username, // Username from JWT token
        message: message.trim(),
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        sessionId: userId, // Include unique session ID
      };

      // Send the message via socket
      socket.emit('send_message', msgData);

      // Add the message locally
      setMessageList((list) => [...list, msgData]);

      // Clear the input field
      setMessage('');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 text-white bg-center bg-cover"
         style={{ backgroundImage: 'url("/chat.jpeg")' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col w-full max-w-4xl p-6 space-y-8 bg-white shadow-lg bg-opacity-80 rounded-xl backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">Chat Room: {room}</h2>
        
        {/* Chat Messages Section */}
        <div className="p-4 mb-6 space-y-4 overflow-y-auto bg-gray-200 rounded-lg shadow-md h-96">
          {messageList.map((msg, i) => (
            <div key={i} className={`flex ${msg.sessionId === userId ? 'justify-end' : 'justify-start'} items-center`}>
              <div className={`p-3 rounded-lg min-w-[400px] h-[112px] text-white shadow-lg ${msg.sessionId === userId ? 'bg-green-600' : 'bg-blue-600'}`}>
                <p className="font-semibold">{msg.author}</p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs justify-self-end">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input and Send Button */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 px-4 py-3 text-black transition-all duration-300 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 text-white transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l hover:from-blue-800 hover:to-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
