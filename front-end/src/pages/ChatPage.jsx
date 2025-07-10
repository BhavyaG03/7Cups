import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { FaUserSecret, FaHeadphones } from "react-icons/fa";

const socket = io(`${import.meta.env.VITE_API_URL}`, { autoConnect: false });
// Gender-neutral static avatar
const neutralAvatar = "https://ui-avatars.com/api/?name=User&background=random&rounded=true";

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
  const userName = user.user.username;
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the other party's name for the header
  const listenerName = location.state?.listenerName || "Listener";
  const headerName = role === "user" ? listenerName : "Anonymous";

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
      socket.on("user_typing", ({ userName }) => {
        setIsTyping(true);
        setTypingUser(userName);
        if (typingTimeout) clearTimeout(typingTimeout);
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

  useEffect(() => {
    scrollToBottom();
  }, [messageList, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateStatus = async (status) => {
    if (role === "listener") {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit/${id}`, { status: status });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const resetIdleTimer = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    setIdleTimeout(setTimeout(() => updateStatus("busy"), 45000));
  };

  const [typingTimerId, setTypingTimerId] = useState(null);
  const handleTyping = () => {
    if (!room) return;
    if (typingTimerId) clearTimeout(typingTimerId);
    const timerId = setTimeout(() => {
      const author = role === "user" ? "Anonymous speaker" : userName;
      socket.emit("user_typing", { room, userName: author });
    }, 300);
    setTypingTimerId(timerId);
  };

  const sendMessage = () => {
    if (message.trim() !== "" && room) {
      const msgData = {
        room,
        author: role === "user" ? "Anonymous" : listenerName,
        message: message.trim(),
        time: new Date().toLocaleTimeString(),
        isLocal: true,
        side: role === "user" ? "right" : "left",
        name: role === "user" ? "Anonymous" : listenerName,
      };
      socket.emit("send_message", msgData);
      setMessageList((list) => [...list, msgData]);
      setMessage("");
      updateStatus("busy");
      resetIdleTimer();
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
      let user_role = role;
      socket.emit("chatEnded", { room_id, listener_id, user_id, user_role }, room_id);
      navigate("/review", { state: { room_id, listener_id, user_id, user_role } });
    } catch (error) {
      console.error("Error getting chat data:", error);
    }
  };

  useEffect(() => {
    socket.on("chatEnded", ({ room_id, listener_id, user_id, user_role }) => {
      alert(`Chat ended by ${user_role}`);
      navigate("/review", { state: { room_id, listener_id, user_id, user_role } });
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
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/logout`, { id: id });
      }
      socket.emit("report", { reported_by, reported_person, room_id }, room_id);
      navigate("/report", { state: { reported_by, room_id, reported_person } });
    } catch (error) {
      console.error("Error reporting user:", error);
    }
  };
  useEffect(() => {
    socket.on("report", ({ reported_person, room_id, reported_by }) => {
      if (reported_person === id) {
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
      if (role === "user") {
        navigate("/pro/therapy");
      }
      if (role === "listener") {
        navigate('/review', { state: { listener_id, room_id, user_id } });
      }
    });
    return () => socket.off("sos");
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      if (typingTimeout) clearTimeout(typingTimeout);
      if (typingTimerId) clearTimeout(typingTimerId);
    };
  }, [idleTimeout, typingTimeout, typingTimerId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="text-3xl font-bold px-12 pt-10 pb-2">{headerName}</div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col px-12 pt-4 pb-32 space-y-6">
        {messageList.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.side === "left" ? "justify-start" : "justify-end"}`}
          >
            {msg.side === "left" && (
              <>
                <span className="mr-3 self-end">
                  <FaHeadphones size={40} className="text-blue-500 bg-white rounded-full p-2 border" />
                </span>
                <div className="flex flex-col max-w-xl items-start">
                  <span className="text-xs text-gray-500 mb-1">{listenerName}</span>
                  <div
                    className="rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-800"
                    style={{ fontFamily: 'inherit', fontWeight: 400, maxWidth: '340px', wordBreak: 'break-word', lineHeight: '1.4' }}
                  >
                    {msg.message}
                  </div>
                </div>
              </>
            )}
            {msg.side === "right" && (
              <>
                <div className="flex flex-col max-w-xl items-end">
                  <span className="text-xs text-gray-500 mb-1">Anonymous</span>
                  <div
                    className="rounded-xl px-3 py-2 text-sm bg-blue-100 text-gray-800"
                    style={{ fontFamily: 'inherit', fontWeight: 400, maxWidth: '340px', wordBreak: 'break-word', lineHeight: '1.4' }}
                  >
                    {msg.message}
                  </div>
                </div>
                <span className="ml-3 self-end">
                  <FaUserSecret size={40} className="text-gray-400 bg-white rounded-full p-2 border" />
                </span>
              </>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center justify-start">
            <div className="flex flex-col max-w-xl items-start">
              <span className="text-xs text-gray-500 mb-1">{listenerName}</span>
              <div className="rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-800 flex items-center gap-2">
                typing
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <span className="ml-3 self-end">
              <FaHeadphones size={40} className="text-blue-500 bg-white rounded-full p-2 border" />
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input bar */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center bg-white pb-8">
        <div className="flex items-center w-full max-w-2xl bg-gray-100 rounded-2xl px-4 py-3 shadow-md">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none border-none text-base px-2 py-2 placeholder-gray-400"
            placeholder="Type a message"
            value={message}
            onChange={e => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="mx-2 text-gray-400 hover:text-red-600"
            onClick={report}
            title="Report"
          >
            <span role="img" aria-label="flag" style={{ fontSize: 22, color: 'red' }}>🚩</span>
          </button>
          <button
            className={`mx-2 ${role === 'listener' ? 'text-red-600' : 'hidden'}`}
            onClick={sos}
            title="SOS"
          >
            {/* Red triangle for SOS */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12,3 22,20 2,20" fill="#dc2626" />
            </svg>
          </button>
          <button
            className="mx-2 text-blue-600 hover:text-blue-800"
            onClick={endChat}
            title="End Chat / Feedback"
          >
            {/* Feedback icon: chat bubble with checkmark */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 11 12 14 15 11" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          <button
            className="ml-2 bg-blue-100 text-gray-700 rounded-full px-6 py-2 font-semibold hover:bg-blue-200 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <style jsx>{`
        .dot {
          margin: 0 1px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #888;
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