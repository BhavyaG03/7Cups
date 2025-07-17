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
  const [showOnboardModal, setShowOnboardModal] = useState(false);

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

  useEffect(() => {
    if (!localStorage.getItem('chatOnboarded')) {
      setShowOnboardModal(true);
      const timer = setTimeout(() => setShowOnboardModal(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setShowOnboardModal(false);
    localStorage.setItem('chatOnboarded', 'true');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Onboarding Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xs w-full text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-3">Welcome to Chat</h2>
            <div className="space-y-2 text-base">
              <div><span role="img" aria-label="flag">🚩</span> <span className="font-medium">Report</span>: Flag user</div>
              <div><span role="img" aria-label="sos">🔺</span> <span className="font-medium">SOS</span>: Urgent help</div>
              <div><span role="img" aria-label="end">👤</span> <span className="font-medium">End</span>: Finish chat</div>
              <div><span className="font-medium">Send</span>: Send message</div>
            </div>
            <div className="text-xs text-gray-400 mt-4">This will disappear in 10 seconds</div>
            <button className="mt-3 px-4 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200" onClick={handleCloseModal}>Got it</button>
          </div>
        </div>
      )}
      {/* Cozy image and chat area container */}
      <div className="max-w-5xl w-full mx-auto px-2 sm:px-4">
        {/* Cozy image at the top */}
        <img
          src="/study.png"
          alt="Cozy study"
          className="w-full h-40 sm:h-56 object-cover rounded-2xl mt-4 sm:mt-8 mb-4 sm:mb-6"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
        />
        {/* Header */}
        <div className="text-2xl sm:text-3xl font-bold pt-1 sm:pt-2 pb-1 sm:pb-2 text-center">
          {headerName}
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col pt-2 sm:pt-4 pb-28 sm:pb-32 space-y-4 sm:space-y-6 w-full">
          {messageList.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.side === "left" ? "justify-start" : "justify-end"}`}
            >
              {msg.side === "left" && (
                <>
                  <span className="mr-2 sm:mr-3 self-end">
                    <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
                      <FaHeadphones className="text-blue-500 w-5 h-5 sm:w-7 sm:h-7" />
                    </span>
                  </span>
                  <div className="flex flex-col max-w-[80vw] sm:max-w-xl items-start">
                    <span className="text-xs text-gray-500 mb-0.5 sm:mb-1">{listenerName}</span>
                    <div
                      className="rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm bg-[#F5F2F0] text-[#171412]"
                      style={{ fontFamily: 'inherit', fontWeight: 400, maxWidth: '340px', wordBreak: 'break-word', lineHeight: '1.4' }}
                    >
                      {msg.message}
                    </div>
                  </div>
                </>
              )}
              {msg.side === "right" && (
                <>
                  <div className="flex flex-col max-w-[80vw] sm:max-w-xl items-end">
                    <span className="text-xs text-gray-500 mb-0.5 sm:mb-1">Anonymous</span>
                    <div
                      className="rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm bg-[#EB9642] text-[#171412]"
                      style={{ fontFamily: 'inherit', fontWeight: 400, maxWidth: '340px', wordBreak: 'break-word', lineHeight: '1.4' }}
                    >
                      {msg.message}
                    </div>
                  </div>
                  <span className="ml-2 sm:ml-3 self-end">
                    <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
                      <FaUserSecret className="text-gray-400 w-5 h-5 sm:w-7 sm:h-7" />
                    </span>
                  </span>
                </>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center justify-start">
              <div className="flex flex-col max-w-[80vw] sm:max-w-xl items-start">
                <span className="text-xs text-gray-500 mb-0.5 sm:mb-1">{listenerName}</span>
                <div className="rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm bg-gray-100 text-gray-800 flex items-center gap-2">
                  typing
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <span className="ml-2 sm:ml-3 self-end">
                <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
                  <FaHeadphones className="text-blue-500 w-5 h-5 sm:w-7 sm:h-7" />
                </span>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input bar */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center bg-white pb-4 sm:pb-8 px-2 sm:px-0 z-10 border-t border-gray-200 sm:border-t-0">
        <div className="flex items-center w-full max-w-lg sm:max-w-2xl bg-gray-100 rounded-2xl px-2 sm:px-4 py-2 sm:py-3 shadow-md">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none border-none text-base px-1.5 sm:px-2 py-2 placeholder-gray-400"
            placeholder="Type a message"
            value={message}
            onChange={e => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{ fontSize: '1rem' }}
          />
          <button
            className="mx-1 sm:mx-2 text-gray-400 hover:text-red-600"
            onClick={report}
            title="Report"
          >
            <span role="img" aria-label="flag" style={{ fontSize: 20, color: 'red' }}>🚩</span>
          </button>
          <button
            className={`mx-1 sm:mx-2 ${role === 'listener' ? 'text-red-600' : 'hidden'}`}
            onClick={sos}
            title="SOS"
          >
            {/* Red triangle for SOS */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="12,3 22,20 2,20" fill="#dc2626" />
            </svg>
          </button>
          <button
            className="mx-1 sm:mx-2 text-blue-600 hover:text-blue-800"
            onClick={endChat}
            title="End Chat / Feedback"
          >
            {/* Feedback icon: chat bubble with checkmark */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 11 12 14 15 11" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          <button
            className="ml-1 sm:ml-2 bg-blue-100 text-gray-700 rounded-full px-4 sm:px-6 py-2 font-semibold hover:bg-blue-200 transition text-sm sm:text-base"
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
        @media (max-width: 640px) {
          .dot { width: 5px; height: 5px; }
        }
      `}</style>
    </div>
  );
}

export default ChatPage;