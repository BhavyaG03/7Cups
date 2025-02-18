import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const socket = io(`${import.meta.env.VITE_API_URL}`, { autoConnect: false });

function ChatPage() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [idleTimeout, setIdleTimeout] = useState(null);

  const user = useSelector((state) => state.user.user);
  const id = user?.user?.id;
  const role = user.role;
  const userName = user.user.username;//offline

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (role === "user") {
      setRoom(location.state.room_id);
    } else {
      const fetchUserData = async () => {
        try {
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
  }, [location, id, role]);

  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
  
      const handleReceiveMessage = (data) => {
        setMessageList((list) =>
          list.some((msg) => msg.time === data.time && msg.message === data.message) ? list : [...list, data]
        );
        updateStatus("busy");
      };
      const handleRoomFull = (data) => {
        alert(data.message); 
        navigate("/user/dashboard"); 
      };
  
      socket.on("receive_message", handleReceiveMessage);
      socket.on("room_full", handleRoomFull);
  
      return () => {
        socket.emit("leave_room", room);
        socket.off("receive_message", handleReceiveMessage);
        socket.off("room_full", handleRoomFull);
      };
    }
  }, [room]);
  

  const updateStatus = async (status) => {
    if (role === "listener") {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit/${id}`, { status:status });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const resetIdleTimer = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    setIdleTimeout(setTimeout(() => updateStatus("active"), 45000)); // 30s idle time
  };

  const sendMessage = () => {
    if (message.trim() !== "" && room) {
      const msgData = { room, author: role === "user" ? "Anonymous speaker" : "Anonymous listener", message: message.trim(), time: new Date().toLocaleTimeString() };
      socket.emit("send_message", msgData);
      setMessageList((list) => [...list, { ...msgData, isLocal: true }]);
      setMessage("");
      updateStatus("busy");
      resetIdleTimer();
    }
  };

  const endChat = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${room}`);
      const { room_id, listener_id, user_id } = response.data;

      console.log("Chat ended, emitting event to room:", room_id);
      socket.emit("chatEnded", { room_id, listener_id, user_id }, room_id);

      updateStatus("active");
      navigate("/review", { state: { room_id, listener_id, user_id } });
    } catch (error) {
      console.error("Error getting chat data:", error);
    }
  };

  useEffect(() => {
    socket.on("chatEnded", ({ room_id, listener_id, user_id }) => {
      console.log("Received chatEnded event for room:", room_id);
      navigate("/review", { state: { room_id, listener_id, user_id } });
    });

    return () => socket.off("chatEnded");
  }, []);

  const report = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${room}`);
      const { room_id, listener_id, user_id } = response.data;
      let reported_person = "";
      let reported_by = "";

      if (role === "user") {
        reported_person = listener_id;
        reported_by = user_id;

      } else if (role === "listener") {
        reported_person = user_id;
        reported_by = listener_id;
      }
      socket.emit("report", { reported_by, reported_person, room_id }, room_id);
      navigate("/report", { state: { reported_by, room_id, reported_person } });
    } catch (error) {
      console.error("Error reporting user:", error);
    }
  };
  useEffect(() => {
    socket.on("report", ({ reported_person, room_id,reported_by }) => {
      if (reported_person === id) {
        console.log("You have been reported!");
          navigate(`/${role}/dashboard`);
      }
    });
  
    return () => socket.off("report");
  }, [id, role]);
  

  const sos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${room}`);
      const { room_id, listener_id, user_id } = response.data;

      console.log("SOS triggered, emitting event:", { room_id, listener_id, user_id });
      socket.emit("sos", { room_id, listener_id, user_id }, room_id);

      if (role === "user") {
        navigate("/pro/therapy");
      }
      if (role === "listener") {
        navigate('/review', { state: { listener_id, room_id, user_id } });
      }
    } catch (error) {
      console.error("Error triggering SOS:", error);
    }
  };

  useEffect(() => {
    socket.on("sos", ({ room_id, listener_id, user_id }) => {
      console.log("Received SOS event, redirecting user...", { room_id, listener_id, user_id });

      if (role === "user") {
        navigate("/pro/therapy");
      }
      if (role === "listener") {
        navigate('/review', { state: { listener_id, room_id, user_id } });
      }
    });

    return () => socket.off("sos");
  }, []);

  /* useEffect(() => {
    return () => {
      updateStatus("offline");
      if (idleTimeout) clearTimeout(idleTimeout);
    };
  }, []); */

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-400 bg-center bg-cover">
      <Header></Header>
      <div className="relative flex flex-col w-full max-w-5xl gap-3 p-6 shadow-lg bg-slate-600 bg-opacity-80 rounded-xl backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Chat Room: {room || "None"}
        </h2>

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
        <div className="flex items-end w-full h-[55px] space-x-4">
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
          <button onClick={sendMessage} className="h-10 px-6 py-2 text-white bg-blue-600 rounded-full w-28 hover:bg-blue-700">
            Send
          </button>
          <div className="flex flex-col items-start justify-start gap-2">
            <button onClick={report} className="px-6 py-2 text-white bg-red-600 rounded-full w-28 hover:bg-red-800">
              Report
            </button>
            <button onClick={endChat} className="px-6 py-2 text-white bg-yellow-400 rounded-full w-28 hover:bg-yellow-500">
              End Chat
            </button>
          </div>
          <button
            onClick={sos}
            className={`${role === "listener" ? "px-6 py-2 text-white bg-red-900 rounded-full w-28 hover:bg-red-500" : "hidden"}`}
          >
            SOS
          </button>
        </div>
      </div>
      <p className="w-1/2 mt-4 text-sm text-center text-gray-700">
  ⚠ Please remember: Calmify is not a substitute for therapy or emergency services. Our volunteers are here to listen and support, but they are not mental health professionals. If you are in crisis or need urgent help, please contact a licensed professional or a crisis hotline immediately.
  <br />
  <span className="text-[14px]">For your safety, do not share personal identification details during this chat.</span>
</p>

    </div>
  );
}

export default ChatPage;
