import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://calmify-backend.onrender.com', { autoConnect: false });

function ChatPage() {
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState('Anonymous');

  useEffect(() => {
    // Decode JWT to extract username
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Payload = token.split('.')[1]; // Extract the payload part
        const decodedPayload = JSON.parse(atob(base64Payload));
        setUsername(decodedPayload?.username || 'Anonymous');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Connect to the socket and join the room
    socket.connect();

    socket.emit('join_room', room);

    const handleReceiveMessage = (data) => {
      // Avoid duplicate messages (check if it already exists in messageList)
      setMessageList((list) => {
        if (list.some((msg) => msg.time === data.time && msg.message === data.message)) {
          return list;
        }
        return [...list, data];
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    // Cleanup listeners and disconnect socket on component unmount
    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const msgData = {
        room,
        author: username,
        message: message.trim(),
        time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      };

      // Emit and update message list locally
      socket.emit('send_message', msgData);
      setMessageList((list) => [...list, { ...msgData, isLocal: true }]);
      setMessage('');
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4 text-white bg-center bg-cover"
      style={{ backgroundImage: 'url("/chat.jpeg")' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col w-full max-w-4xl p-6 space-y-8 bg-white shadow-lg bg-opacity-80 rounded-xl backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">Chat Room: {room}</h2>

        <div className="p-4 mb-6 space-y-4 overflow-y-auto bg-gray-200 rounded-lg shadow-md h-96">
          {messageList.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.isLocal ? 'justify-end' : 'justify-start'
              } items-center`}
            >
              <div
                className={`p-3 rounded-lg min-w-[200px] text-white shadow-lg ${
                  msg.isLocal ? 'bg-green-600' : 'bg-blue-600'
                }`}
              >
                <p className="font-semibold">{msg.author}</p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs justify-self-end">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
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
