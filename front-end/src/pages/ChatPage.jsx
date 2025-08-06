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

// Helper to format last seen
function formatLastSeen(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return date.toLocaleString();
}

function ChatPage() {
  const location = useLocation();
  const [messageList, setMessageList] = useState([]);
  // Use sessionStorage for user and room context
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [room, setRoom] = useState(() => sessionStorage.getItem('room_id') || (location.state?.room_id || ""));
  const [message, setMessage] = useState("");
  const [idleTimeout, setIdleTimeout] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [otherStatus, setOtherStatus] = useState({ status: '', lastSeen: '' });
  const socketRef = useRef(null);
  const hasJoinedRoom = useRef(false);
  // Use user?.id, user?.username, user?.role, etc. everywhere below
  const id = user?.id;
  const role = user?.role;
  const userName = user?.username;
  const navigate = useNavigate();
  // Track if listener has sent their first message
  const hasSetBusy = useRef(false);
  // Track if we've already shown the speaker's Q&A
  const hasShownQnA = useRef(false);

  // Determine the other party's name for the header
  const listenerName = location.state?.listenerName || "Listener";
  const headerName = role === "user" ? listenerName : "Anonymous";

  useEffect(() => {
    if (user && room) {
      socketRef.current = io(`${import.meta.env.VITE_API_URL}`, { autoConnect: true });
      // Only emit join_room once
      if (!hasJoinedRoom.current) {
        socketRef.current.emit("join_room", room);
        hasJoinedRoom.current = true;
      }

      // Fallback: Fetch messages via API if socket fails
      const fetchMessagesFallback = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${room}`);
          if (response.data && response.data.length > 0) {
            setMessageList(response.data);
          }
        } catch (error) {
          console.error("Error fetching messages via API:", error);
        }
      };

      // Set a timeout to fetch messages if socket doesn't respond
      const messageTimeout = setTimeout(fetchMessagesFallback, 3000);
      
      // Clear timeout if messages are loaded via socket
      const handleMessagesLoaded = () => {
        clearTimeout(messageTimeout);
      };
      
      socketRef.current.on("load_messages", (messages) => {
        handleMessagesLoaded();
        setMessageList(messages);
      });

      // Attach all socket event handlers only once
      const handleUserJoined = ({ userName }) => {
        new Audio("/discordJoin.mp3").play();
        toast.info("Someone joined the chat");
      };
      const handleUserLeft = ({ userName }) => {
        new Audio("/discordLeave.mp3").play();
        toast.warning("Someone left the chat");
      };
      const handleUserTyping = ({ userName }) => {
        setIsTyping(true);
        setTypingUser(userName);
        if (typingTimeout) clearTimeout(typingTimeout);
        const timeout = setTimeout(() => {
          setIsTyping(false);
          setTypingUser("");
        }, 3000);
        setTypingTimeout(timeout);
      };
      const handleReceiveMessage = (data) => {
        setMessageList((list) =>
          list.some((msg) => msg.time === data.time && msg.message === data.message) ? list : [...list, data]
        );
        setIsTyping(false);
      };
      const handleLoadMessages = (messages) => {
        setMessageList(messages);
        // Clear the fallback timeout since messages were loaded via socket
        if (messageTimeout) {
          clearTimeout(messageTimeout);
        }
      };
      const handleRoomFull = (data) => {
        // Only show error if not already in the room
        if (!hasJoinedRoom.current) {
          alert(data.message);
          navigate("/user/dashboard");
        }
      };

      socketRef.current.on("user_joined", handleUserJoined);
      socketRef.current.on("user_left", handleUserLeft);
      socketRef.current.on("user_typing", handleUserTyping);
      socketRef.current.on("receive_message", handleReceiveMessage);
      socketRef.current.on("load_messages", handleLoadMessages);
      socketRef.current.on("room_full", handleRoomFull);

      return () => {
        if (socketRef.current) {
                  socketRef.current.off("user_joined", handleUserJoined);
        socketRef.current.off("user_left", handleUserLeft);
        socketRef.current.off("user_typing", handleUserTyping);
        socketRef.current.off("receive_message", handleReceiveMessage);
        socketRef.current.off("load_messages", handleLoadMessages);
        socketRef.current.off("room_full", handleRoomFull);
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        hasJoinedRoom.current = false;
      };
    }
  }, [user, room]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to fetch and display speaker's Q&A
  const fetchAndDisplaySpeakerQnA = async (speakerId) => {
    if (role !== "listener" || hasShownQnA.current) return;
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/responses/latest/${speakerId}`);
      const qnaData = response.data;
      
      if (qnaData && qnaData.responses) {
        // Format the Q&A into a readable message with better styling
        let qnaMessage = "📋 **Speaker's Responses**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        
        qnaData.responses.forEach((item, index) => {
          qnaMessage += `**${index + 1}. ${item.question}**\n`;
          if (Array.isArray(item.answer)) {
            qnaMessage += `  • ${item.answer.join('\n  • ')}\n\n`;
          } else {
            qnaMessage += `  → ${item.answer}\n\n`;
          }
        });
        
        if (qnaData.additionalNotes && qnaData.additionalNotes.trim()) {
          qnaMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n**💭 Additional Notes:**\n→ ${qnaData.additionalNotes}\n\n`;
        }
        
        // Add the Q&A as the first message
        const qnaMsgData = {
          room,
          author: "Anonymous",
          message: qnaMessage,
          time: new Date().toLocaleTimeString(),
          isLocal: true,
          side: "right",
          name: "Anonymous",
        };
        
        setMessageList(prev => [qnaMsgData, ...prev]);
        hasShownQnA.current = true;
      }
    } catch (error) {
      console.error("Error fetching speaker Q&A:", error);
    }
  };

  const updateStatus = async (status) => {
    if (role === "listener" && (status === "online" || status === "offline")) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit/${id}`, { status: status });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  // Remove idle timer logic for busy status

  const [typingTimerId, setTypingTimerId] = useState(null);
  const handleTyping = () => {
    if (!room || !socketRef.current) return;
    if (typingTimerId) clearTimeout(typingTimerId);
    const timerId = setTimeout(() => {
      const author = role === "user" ? "Anonymous speaker" : userName;
      socketRef.current.emit("user_typing", { room, userName: author });
    }, 300);
    setTypingTimerId(timerId);
  };

  const sendMessage = async () => {
    if (message.trim() !== "" && room && socketRef.current) {
      const msgData = {
        room,
        author: role === "user" ? "Anonymous" : listenerName,
        message: message.trim(),
        time: new Date().toLocaleTimeString(),
        isLocal: true,
        side: role === "user" ? "right" : "left",
        name: role === "user" ? "Anonymous" : listenerName,
      };
      socketRef.current.emit("send_message", msgData);
      // If listener, set status to busy only on first message
      if (user?.role === "listener" && !hasSetBusy.current) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit/${user.id}`, { status: "busy" });
        hasSetBusy.current = true;
      }
      setMessage("");
      if (typingTimerId) {
        clearTimeout(typingTimerId);
        setTypingTimerId(null);
      }
    }
  };

  // On chat end or logout, clear room_id from sessionStorage
  const endChat = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${room}`);
      const { room_id, listener_id, user_id } = response.data;
      let user_role = user?.role;
      if (socketRef.current) {
        socketRef.current.emit("chatEnded", { room_id, listener_id, user_id, user_role }, room_id);
      }
      // Always set listener status to offline and clear room_id when chat ends
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit/${listener_id}`, { 
        status: "offline", 
        room_id: null 
      });
      sessionStorage.removeItem('room_id');
      navigate("/review", { state: { room_id, listener_id, user_id, user_role } });
    } catch (error) {
      console.error("Error getting chat data:", error);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("chatEnded", async ({ room_id, listener_id, user_id, user_role }) => {
        alert(`Chat ended by ${user_role}`);
        // If current user is the listener, set status to offline and clear room_id
        if (user?.role === "listener") {
          try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/edit/${user.id}`, { 
              status: "offline", 
              room_id: null 
            });
          } catch (error) {
            console.error("Error updating listener status:", error);
          }
        }
        sessionStorage.removeItem('room_id');
        navigate("/review", { state: { room_id, listener_id, user_id, user_role } });
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("chatEnded");
      }
    };
  }, [user?.role, user?.id]);

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
      if (socketRef.current) {
        socketRef.current.emit("report", { reported_by, reported_person, room_id }, room_id);
      }
      navigate("/report", { state: { reported_by, room_id, reported_person } });
    } catch (error) {
      console.error("Error reporting user:", error);
    }
  };
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("report", ({ reported_person, room_id, reported_by }) => {
        if (user?.id && reported_person === user.id) {
          alert("⚠ You have been reported for inappropriate behavior.\n\nOur platform is a safe space for respectful and supportive conversations. If you continue to violate our community guidelines, your account will be automatically banned.");
          navigate(`/${user?.role}/dashboard`);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("report");
      }
    };
  }, [user?.id, user?.role]);

  const sos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${room}`);
      const { room_id, listener_id, user_id } = response.data;
      if (socketRef.current) {
        socketRef.current.emit("sos", { room_id, listener_id, user_id }, room_id);
      }
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
    if (socketRef.current) {
      socketRef.current.on("sos", ({ room_id, listener_id, user_id }) => {
        if (user?.role === "user") {
          navigate("/pro/therapy");
        }
        if (user?.role === "listener") {
          navigate('/review', { state: { listener_id, room_id, user_id } });
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("sos");
      }
    };
  }, [user?.role]);

  useEffect(() => {
    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      if (typingTimeout) clearTimeout(typingTimeout);
      if (typingTimerId) clearTimeout(typingTimerId);
    };
  }, [idleTimeout, typingTimeout, typingTimerId]);

  // Fetch other party's status and speaker's Q&A
  useEffect(() => {
    let otherId = null;
    let pollingRoom = false;
    let roomPollInterval = null;
    if (role === 'user') {
      otherId = location.state?.listenerId || location.state?.listener_id;
    } else {
      otherId = location.state?.userId || location.state?.user_id;
      // If otherId is not set, poll the room endpoint until user_id is available
      if (!otherId && location.state?.room_id) {
        pollingRoom = true;
        const fetchRoomUserId = async () => {
          try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${location.state.room_id}`);
            if (res.data && res.data.user_id) {
              otherId = res.data.user_id;
              setOtherStatus({ status: '', lastSeen: '' }); // Reset status
              // Fetch speaker's Q&A for listener
              if (role === 'listener') {
                fetchAndDisplaySpeakerQnA(otherId);
              }
              // Now start polling for status
              const fetchStatus = () => {
                axios.get(`${import.meta.env.VITE_API_URL}/api/users/status/${otherId}`)
                  .then(res => setOtherStatus(res.data))
                  .catch(() => setOtherStatus({ status: '', lastSeen: '' }));
              };
              fetchStatus();
              roomPollInterval && clearInterval(roomPollInterval);
              roomPollInterval = setInterval(fetchStatus, 5000);
            }
          } catch {}
        };
        fetchRoomUserId();
        roomPollInterval = setInterval(fetchRoomUserId, 2000);
        return () => clearInterval(roomPollInterval);
      }
    }
    console.log("Other party ID for status:", otherId); // Debug log
    if (otherId) {
      // Fetch speaker's Q&A for listener if we have the speaker ID
      if (role === 'listener') {
        fetchAndDisplaySpeakerQnA(otherId);
      }
      const fetchStatus = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/status/${otherId}`)
          .then(res => setOtherStatus(res.data))
          .catch(() => setOtherStatus({ status: '', lastSeen: '' }));
      };
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [location, role]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cozy image and chat area container */}
      <div className="w-full max-w-5xl px-2 mx-auto sm:px-4">
        {/* Cozy image at the top */}
        <img
          src="/study.png"
          alt="Cozy study"
          className="object-cover w-full h-40 mt-4 mb-4 sm:h-56 rounded-2xl sm:mt-8 sm:mb-6"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
        />
        {/* Header */}
        <div className="pt-1 pb-1 text-2xl font-bold text-center sm:text-3xl sm:pt-2 sm:pb-2">
          {headerName}
        </div>
        <div className="mb-2 text-xs text-center text-gray-500">
          {otherStatus.status === 'busy'
            ? 'Busy'
            : otherStatus.status === 'online'
              ? 'Online'
              : otherStatus.lastSeen
                ? `Last seen ${formatLastSeen(otherStatus.lastSeen)}`
                : 'Status unknown'}
        </div>
        {/* Chat area */}
        <div className="flex flex-col flex-1 w-full pt-2 space-y-4 sm:pt-4 pb-28 sm:pb-32 sm:space-y-6">
          {messageList.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.side === "left" ? "justify-start" : "justify-end"}`}
            >
              {msg.side === "left" && (
                <>
                  <span className="self-end mr-2 sm:mr-3">
                    <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
                      <FaHeadphones className="w-5 h-5 text-blue-500 sm:w-7 sm:h-7" />
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
                  <span className="self-end ml-2 sm:ml-3">
                    <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
                      <FaUserSecret className="w-5 h-5 text-gray-400 sm:w-7 sm:h-7" />
                    </span>
                  </span>
                </>
              )}
            </div>
          ))}
          {isTyping && (
  <div className={`flex ${
    // If Anonymous speaker is typing, show on right side, otherwise left
    typingUser === "Anonymous speaker" ? "justify-end" : "justify-start"
  }`}>
    {/* Show listener avatar on left only when LISTENER is typing */}
    {typingUser !== "Anonymous speaker" && (
      <span className="self-end mr-2 sm:mr-3">
        <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
          <FaHeadphones className="w-5 h-5 text-blue-500 sm:w-7 sm:h-7" />
        </span>
      </span>
    )}
    
    <div className={`flex flex-col max-w-[80vw] sm:max-w-xl ${
      typingUser === "Anonymous speaker" ? "items-end" : "items-start"
    }`}>
      <span className="text-xs text-gray-500 mb-0.5 sm:mb-1">
        {typingUser === "Anonymous speaker" ? "Anonymous" : listenerName}
      </span>
      <div className={`rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm flex items-center gap-2 ${
        typingUser === "Anonymous speaker"
          ? "bg-[#EB9642] text-[#171412]" // Anonymous speaker styling (orange)
          : "bg-[#F5F2F0] text-[#171412]" // Listener styling (light beige)
      }`}>
        typing
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
    
    {/* Show speaker avatar on right only when ANONYMOUS SPEAKER is typing */}
    {typingUser === "Anonymous speaker" && (
      <span className="self-end ml-2 sm:ml-3">
        <span className="bg-white rounded-full border flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2">
          <FaUserSecret className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
        </span>
      </span>
    )}
  </div>
)}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input bar */}
      <div className="fixed bottom-0 left-0 z-10 flex justify-center w-full px-2 pb-4 bg-white border-t border-gray-200 sm:pb-8 sm:px-0 sm:border-t-0">
        <div className="flex items-center w-full max-w-lg px-2 py-2 bg-gray-100 shadow-md sm:max-w-2xl rounded-2xl sm:px-4 sm:py-3">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none border-none text-base px-1.5 sm:px-2 py-2 placeholder-gray-400 min-w-0"
            placeholder="Type a message"
            value={message}
            onChange={e => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{ fontSize: '1rem' }}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 sm:px-3 sm:text-sm"
              onClick={report}
              title="Report"
            >
              Report
            </button>
            <button
              className={`px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 sm:px-3 sm:text-sm ${role === 'listener' ? '' : 'hidden'}`}
              onClick={sos}
              title="SOS"
            >
              SOS
            </button>
            <button
              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 sm:px-3 sm:text-sm"
              onClick={endChat}
              title="End Chat / Feedback"
            >
              End
            </button>
            <button
              className="px-3 py-1 text-xs font-semibold text-gray-700 transition bg-blue-100 rounded hover:bg-blue-200 sm:px-4 sm:text-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <style>{`
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