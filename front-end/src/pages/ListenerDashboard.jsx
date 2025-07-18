import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Header from "../components/Header";

const ListenerDashboard = () => {
  const apiUrl=import.meta.env.VITE_API_URL
  const user = useSelector((state) => state.user.user);
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
    if (!user?.user?.id) return;

    const roomId = generateRoomId();
    try {
      const res = await axios.put(`${apiUrl}/api/users/edit/${user.user.id}`, { room_id: roomId, status: "online" });
      await axios.post(`${apiUrl}/api/chats`, {
        room_id: roomId,
        listener_id: user.user.id
      });
      // Fetch the room info to get the user_id (speaker)
      const roomRes = await axios.get(`${apiUrl}/api/chats/${roomId}`);
      const speakerId = roomRes.data.user_id;
      dispatch(setUser({ ...user, user: { ...user.user, room_id: roomId } }));
      navigate("/chat", { state: { userId: speakerId, listenerId: user.user.id, room_id: roomId } });
    } catch (error) {
      console.error("Error updating room ID:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-3 sm:px-0 py-6" style={{ fontFamily: 'Epilogue, sans-serif' }}>
      {/* Top image and all content in one aligned container */}
      <div className="w-full max-w-5xl mx-auto">
        <img src="/plant.png" alt="Plant" className="w-full h-36 sm:h-56 object-contain aspect-[3/1] rounded-2xl mb-8" />
        {/* Dashboard Title and content */}
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Listener Dashboard</h1>
          {/* Total Sessions */}
          <div className="bg-[#F2EDE8] rounded-xl p-6 mb-8">
            <div className="text-base text-gray-700 mb-1">Total Sessions</div>
            <div className="text-3xl font-bold text-gray-900">230</div>
          </div>
          {/* Forum Moderation Table */}
          <div className="mb-8">
            <div className="font-semibold mb-2">Forum Moderation</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base border-separate border-spacing-0">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-2 font-medium text-gray-700">Name</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Topic</th>
                    <th className="px-4 py-2 font-medium text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-4 py-2 border-t border-gray-200 rounded-tl-xl">Liam</td>
                    <td className="px-4 py-2 border-t border-gray-200 text-[#b88a5a]">I've been having trouble sleeping. Any advice?</td>
                    <td className="px-4 py-2 border-t border-gray-200 rounded-tr-xl">3 days ago</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-2 border-t border-gray-200 rounded-bl-xl">Chloe</td>
                    <td className="px-4 py-2 border-t border-gray-200 text-[#b88a5a]">I'm here to support you. Let's work through this together.</td>
                    <td className="px-4 py-2 border-t border-gray-200 rounded-br-xl">4 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
  );
};

export default ListenerDashboard;
