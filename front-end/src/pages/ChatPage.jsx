import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const socket = io(`${import.meta.env.VITE_API_URL}`, { autoConnect: false });

function ChatPage() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("Anonymous");
  const [roomFull, setRoomFull] = useState(false);

  const user = useSelector((state) => state.user.user);
  const id = user?.user?.id;
  const role=user.role
  const userName=user.user.username
  console.log(role)
  

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        console.log("Decoded Username:", decodedPayload?.username);
        setUsername(decodedPayload?.username || `User-${Math.floor(Math.random() * 1000)}`);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (role==="user") {
      setRoom(location.state.room_id);
    } else {
      const fetchUserData = async () => {
        try {
          const token=user.token
          if (!token) return;

          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
          const userData = response.data;
          if (userData.role === "listener" && userData.room_id) {
            setRoom(userData.room_id);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [location, id,role]);

  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);

      const handleReceiveMessage = (data) => {
        setMessageList((list) =>
          list.some((msg) => msg.time === data.time && msg.message === data.message) ? list : [...list, data]
        );
      };

      socket.on("receive_message", handleReceiveMessage);
      socket.on("room_full", (data) => {
        alert(data.message);
        setRoom("");
        setRoomFull(true);
      });

      return () => {
        socket.emit("leave_room", room);
        socket.off("receive_message", handleReceiveMessage);
        socket.off("room_full");
      };
    }
  }, [room]);

  const sendMessage = () => {
    if (message.trim() !== "" && room) {
      console.log("Sending message from:", userName);
      const msgData = { room, author: userName, message: message.trim(), time: new Date().toLocaleTimeString() };
      socket.emit("send_message", msgData);
      setMessageList((list) => [...list, { ...msgData, isLocal: true }]);
      setMessage("");
    }
  };
  const endChat=()=>{
    alert("these do not work currently :)")
  }
  const report= () => {
    alert("these do not work currently :)")
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4 text-white bg-gray-400 bg-center bg-cover"
    >
      <div className="relative flex flex-col w-full max-w-5xl gap-3 p-6 shadow-lg bg-slate-600 bg-opacity-80 rounded-xl backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          {roomFull ? "Room Full" : `Chat Room: ${room || "None"}`}
        </h2>
        <h4 className="text-2xl font-extrabold text-center text-gray-800">
          This is your safe space to talk 😊
        </h4>

        {/* Chat Messages */}
        <div className="p-4 mb-6 space-y-4 overflow-y-auto bg-gray-200 rounded-lg shadow-md h-96">
          {messageList.map((msg, i) => (
            <div key={i} className={`flex ${msg.isLocal ? "justify-end" : "justify-start"} items-center`}>
              <div
                className={`px-3 pt-2 pb-1 flex flex-col rounded-lg min-w-[500px] text-white shadow-lg ${
                  msg.isLocal ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                <p className="font-semibold">{msg.author}</p>
                <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{msg.message}</p>
                <p className="mt-2 text-xs">{msg.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex w-full h-[55px] space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-full focus:outline-none"
          />
          <div className="flex items-end justify-start gap-2">
          <button
            onClick={sendMessage}
            className="px-6 py-2 text-white bg-blue-600 rounded-full w-28 hover:bg-blue-700"
          >
            Send
          </button>
          <div className="flex flex-col items-start justify-start gap-2">
          <button
            onClick={report}
            className="px-6 py-2 text-white bg-red-600 rounded-full w-28 hover:bg-red-800"
          >
            Report
          </button>
          <button
            onClick={endChat}
            className="px-6 py-2 text-white bg-yellow-400 rounded-full w-28 hover:bg-yellow-500"
          >
            End Chat
          </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
