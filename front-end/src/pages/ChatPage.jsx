import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // backend URL

function ChatPage() {
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // Join default room on mount
    socket.emit('join_room', room);

    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    // Cleanup when unmounting
    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message !== '') {
      const msgData = {
        room,
        author: 'Anonymous', // Or use actual username
        message,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      socket.emit('send_message', msgData);
      setMessageList((list) => [...list, msgData]);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {room}</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto' }}>
        {messageList.map((msg, i) => (
          <div key={i}>
            <strong>{msg.author}: </strong>{msg.message} <em>({msg.time})</em>
          </div>
        ))}
      </div>
      <hr/>
      <input
        type="text"
        placeholder="Your Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatPage;
