import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


const socket = io(`${import.meta.env.VITE_API_URL}`, { autoConnect: false });

function ChatPage() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [idleTimeout, setIdleTimeout] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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
      socket.on("user_joined", ({ userName }) => {
        new Audio("/discordJoin.mp3").play();
        toast.info("Someone joined the chat");
      });
      
      socket.on("user_left", ({ userName }) => {
        new Audio("/discordLeave.mp3").play();
        toast.warning("Someone left the chat");
      });
      
      // Setup typing indicator listener
      socket.on("user_typing", ({ userName }) => {
        console.log("Typing event received from:", userName);
        setIsTyping(true);
        setTypingUser(userName);
        
        // Clear previous timeout if exists
        if (typingTimeout) clearTimeout(typingTimeout);
        
        // Set new timeout to hide typing indicator after 3 seconds
        const timeout = setTimeout(() => {
          setIsTyping(false);
          setTypingUser("");
        }, 3000);
        
        setTypingTimeout(timeout);
      });
      
      const handleReceiveMessage = (data) => {
        setMessageList((list) =>
          list.some((msg) => msg.time === data.time && msg.message === data.message) ? list : [...list, data]
        );
        updateStatus("busy");
        // Hide typing indicator when message is received
        setIsTyping(false);
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
        socket.off("user_typing");
      };
    }
  }, [room]);
  
  // Auto-scroll to latest message whenever messageList updates
  useEffect(() => {
    scrollToBottom();
  }, [messageList, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    setIdleTimeout(setTimeout(() => updateStatus("busy"), 45000));
  };

  // Debounced typing notification to prevent spam
  const [typingTimerId, setTypingTimerId] = useState(null);
  
  const handleTyping = () => {
    if (!room) return;
    
    // Clear existing timer
    if (typingTimerId) clearTimeout(typingTimerId);
    
    // Set a new timer that will emit typing event
    const timerId = setTimeout(() => {
      const author = role === "user" ? "Anonymous speaker" : userName;
      console.log("Emitting typing event for:", author, "in room:", room);
      socket.emit("user_typing", { room, userName: author });
    }, 300); // 300ms debounce
    
    setTypingTimerId(timerId);
  };

  const sendMessage = () => {
    if (message.trim() !== "" && room) {
      const msgData = { room, author: role === "user" ? "Anonymous speaker" : userName, message: message.trim(), time: new Date().toLocaleTimeString() };
      socket.emit("send_message", msgData);
      setMessageList((list) => [...list, { ...msgData, isLocal: true }]);
      setMessage("");
      updateStatus("busy");
      resetIdleTimer();
      
      // Clear typing status when sending a message
      if (typingTimerId) {
        clearTimeout(typingTimerId);
        setTypingTimerId(null);
      }
    }
  };

  const endChat = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${room}`);
      const { room_id, listener_id, user_id } = response.data;
      let user_role=role;
      console.log("Chat ended, emitting event to room:", room_id);
      socket.emit("chatEnded", { room_id, listener_id, user_id,user_role }, room_id);
      navigate("/review", { state: { room_id, listener_id, user_id,user_role } });
    } catch (error) {
      console.error("Error getting chat data:", error);
    }
  };

  useEffect(() => {
    socket.on("chatEnded", ({ room_id, listener_id, user_id,user_role }) => {
      console.log("Received chatEnded event for room:", room_id);
      alert(`Chat ended by ${user_role}`)
      navigate("/review", { state: { room_id, listener_id, user_id,user_role } });
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
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/logout`,{id:id})
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
        console.log("ur reported")
        alert("⚠ You have been reported for inappropriate behavior.\n\nOur platform is a safe space for respectful and supportive conversations. If you continue to violate our community guidelines, your account will be automatically banned.");
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

  // Clean up function
  useEffect(() => {
    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      if (typingTimeout) clearTimeout(typingTimeout);
      if (typingTimerId) clearTimeout(typingTimerId);
    };
  }, [idleTimeout, typingTimeout, typingTimerId]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-400 bg-center bg-cover">
      <Header></Header>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      <div className="relative flex flex-col w-full max-w-5xl gap-3 p-6 shadow-lg bg-slate-600 bg-opacity-80 rounded-xl backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Chat Room: {room || "None"}
        </h2>

        <div 
          ref={chatContainerRef} 
          className="p-4 mb-6 space-y-4 overflow-y-auto bg-gray-200 rounded-lg shadow-md h-96"
        >
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
          {isTyping && (
            <div className="flex items-center justify-start">
              <div className="px-3 py-2 text-white bg-gray-400 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <span className="font-medium">typing</span>
                  <div className="typing-animation">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-end w-full h-[55px] space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Call handleTyping on input change
              handleTyping();
            }}
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
        ⚠ Please remember: MindFree is not a substitute for therapy or emergency services. Our volunteers are here to listen and support, but they are not mental health professionals. If you are in crisis or need urgent help, please contact a licensed professional or a crisis hotline immediately.
        <br />
        <span className="text-[14px]">For your safety, do not share personal identification details during this chat.</span>
      </p>

      <style jsx>{`
        .typing-animation {
          display: inline-flex;
          align-items: center;
        }
        
        .dot {
          margin: 0 1px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: white;
          animation: bounce 1.4s infinite;
          opacity: 0.7;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default ChatPage;