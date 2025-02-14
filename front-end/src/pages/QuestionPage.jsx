import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";


function QuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showListeners, setShowListeners] = useState(false);
  const [listeners, setListeners] = useState([]);
  const user = useSelector((state) => state.user.user);
  const id = user?.user?.id;

  const questions = [
    { question: "What is your age?", options: ["14-18", "19-21", "22-26", "27+"] },
    { question: "What gender do you identify with?", options: ["Woman", "Man", "Prefer not to say"] },
    { question: "What is the main issue you would like to address?", options: ["Anxiety", "Depression", "Relationship Stress", "Social Anxiety", "Loneliness", "Family Stress"] },
  ];

  const navigate = useNavigate();
  const progressBarWidth = ((currentQuestion + 1) / questions.length) * 100;

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      fetchListeners();
    }
  };

  const fetchListeners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users?status=active&role=listener`
      );
      setListeners(response.data);
      setShowListeners(true);
    } catch (error) {
      console.error("Error fetching listeners:", error);
    }
  };

  const handleJoinChat = async (listenerRoomId) => {
    try {
      if (!id) {
        console.error("User ID not found.");
        return;
      }
      console.log("listener id",listenerRoomId)
      await axios.put(`${import.meta.env.VITE_API_URL}/api/chats/${listenerRoomId}`, { 
        user_id: id 
      });      

      navigate(`/chat`, { state: { room_id: listenerRoomId } });
    } catch (error) {
      console.error("Error updating user room:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!showListeners ? (
        <>
          <h1 className="mb-8 text-3xl font-bold">Help us get to know you</h1>
          <div className="h-2 mb-8 bg-gray-200 rounded-full w-96">
            <div className="h-full transition-all duration-500 ease-in-out bg-blue-500 rounded-full" style={{ width: `${progressBarWidth}%` }}></div>
          </div>
          <div className="p-8 bg-white rounded-lg shadow-md w-96">
            <h2 className="mb-4 text-2xl font-semibold text-center">
              {questions[currentQuestion].question}
            </h2>
            <div className="flex flex-col gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button key={index} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none" onClick={nextQuestion}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h2 className="mb-4 text-2xl font-semibold text-center">Available Listeners</h2>
          <ul>
            {listeners.map((listener) => (
              <li key={listener.room_id} className="flex justify-between p-3 mb-2 bg-gray-200 rounded-lg">
                <span>{listener.username}</span>
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded"
                  onClick={() => handleJoinChat(listener.room_id)}
                >
                  Join Chat
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;
