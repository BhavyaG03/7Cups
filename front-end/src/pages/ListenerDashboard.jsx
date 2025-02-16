import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    console.log("Generated Room ID:", roomId);
  
    try {
      const res = await axios.put(`${apiUrl}/api/users/edit/${user.user.id}`, { room_id: roomId,status:"active" });
      console.log("status active now")
      console.log("API Response:", res.data); 
      await axios.post(`${apiUrl}/api/chats`, {
                room_id: roomId,
                listener_id:user.user.id
              });
      console.log("Listener stored")
      dispatch(setUser({ ...user, user: { ...user.user, room_id: roomId } }));
  
      console.log("Updated Redux State:", { ...user, user: { ...user.user, room_id: roomId } });
  
      navigate("/chat");
    } catch (error) {
      console.error("Error updating room ID:", error);
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-5xl font-bold text-gray-800">Hi {user?.user?.username}</h1>
      <button
        onClick={handleJoinChat}
        className="px-8 py-4 text-xl font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
      >
        Join Chat
      </button>
      <div className="w-full max-w-2xl p-3 mt-4 text-xs text-gray-800 rounded-md shadow-xl bg-white/20 backdrop-blur-xl">
  <h3 className="mb-1 text-sm font-semibold text-center text-gray-800">General Disclaimer</h3>
  <p className="leading-tight text-center">
    Calmify is an emotional well-being platform offering a safe space for open conversations. 
    Our volunteers are trained peers, not mental health professionals, and cannot diagnose, 
    treat, or provide medical advice.
    <br /><br />
    This is not a substitute for therapy or emergency services. If you're in crisis or need urgent help, 
    please contact a licensed professional or a crisis hotline.
    <br /><br />
    For your safety, do not share personal identification details on this platform.
  </p>
</div>
    </div>
  );
};

export default ListenerDashboard;
