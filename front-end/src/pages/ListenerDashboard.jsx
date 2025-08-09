import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const ListenerDashboard = () => {
  const apiUrl=import.meta.env.VITE_API_URL
  // Get user from sessionStorage
  const user = (() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  })();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 14);
  };

  const setUser = (user) => ({
    type: "SET_USER",
    payload: user,
  });
  
  const handleJoinChat = async () => {
    if (!user?.id) return;

    const roomId = generateRoomId();
    try {
      // Set status to online when starting session
      await axios.put(`${apiUrl}/api/users/edit/${user.id}`, { room_id: roomId, status: "online" });
      await axios.post(`${apiUrl}/api/chats`, {
        room_id: roomId,
        listener_id: user.id
      });
      // Fetch the room info to get the user_id (speaker)
      const roomRes = await axios.get(`${apiUrl}/api/chats/${roomId}`);
      const speakerId = roomRes.data.user_id;
      // Update sessionStorage with new room_id
      sessionStorage.setItem('room_id', roomId);
      // Do NOT set status to busy here
      navigate("/chat", { state: { userId: speakerId, listenerId: user.id, room_id: roomId } });
    } catch (error) {
      console.error("Error updating room ID:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      <Header />
      <div className="min-h-screen bg-white flex flex-col items-center px-3 sm:px-0 py-6">
        {/* Top image and all content in one aligned container */}
        <div className="w-full max-w-5xl mx-auto">
          <img src="/plant.png" alt="Plant" className="w-full h-36 sm:h-56 object-contain aspect-[3/1] rounded-2xl mb-8" />
          {/* Dashboard Title and content */}
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Listener Dashboard</h1>

            {/* Start Session Button */}
            <div className="mt-6">
              <div className="font-semibold mb-2">Start Session</div>
              <button
                onClick={handleJoinChat}
                className="bg-[#F28026] hover:bg-[#ff9900] text-black font-semibold rounded-full px-2 py-2.5 shadow transition w-1/2 max-w-xs sm:w-60"
              >
                Start New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenerDashboard;
