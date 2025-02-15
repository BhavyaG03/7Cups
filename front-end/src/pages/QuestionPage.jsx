import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function QuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showListeners, setShowListeners] = useState(false);
  const [listeners, setListeners] = useState([]);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const id = user?.user?.id;

  const questions = [
    {
      key: "feelings",
      question: "How do you feel right now? (Select all that apply)",
      options: [
        "I feel restless or constantly on edge.",
        "I struggle to focus or make decisions.",
        "My sleep has been disturbed lately.",
        "I often feel low on energy or exhausted.",
        "I feel guilty, hopeless, or unmotivated.",
        "My heart races, or I feel physically uneasy in certain situations.",
        "I feel disconnected or alone, even around others.",
        "I am struggling with my relationships.",
        "I feel overwhelmed by family expectations or conflicts.",
      ],
      multiple: true,
    },
    {
      key: "additional",
      question: "Is there anything else on your mind that you'd like to share?",
      type: "text",
    },
    {
      key: "conversation_goal",
      question: "What do you hope to get out of this conversation?",
      options: [
        "I just want to vent and express my thoughts.",
        "I want someone to listen and understand me.",
        "I need help making sense of my emotions.",
        "I want to feel less alone in what I’m going through.",
        "I don't know, I just need to talk.",
      ],
    },
  ];

  const navigate = useNavigate();
  const progressBarWidth = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = (answer) => {
    setResponses({ ...responses, [questions[currentQuestion].key]: answer });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      storeResponses();
    }
  };

  const storeResponses = async () => {
    try {
      const payload = {
        userId: id, // Correct key name
        responses: Object.keys(responses).map((key) => ({
          question: questions.find((q) => q.key === key)?.question || key, // Get actual question
          answer: responses[key],
        })),
        additionalNotes: responses.additional || "", // Ensure additional notes are included
      };
  
      await axios.post(`${import.meta.env.VITE_API_URL}/api/responses`, payload);
      fetchListeners();
    } catch (error) {
      console.error("Error storing responses:", error);
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
      console.log("listener id", listenerRoomId);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/chats/${listenerRoomId}`, {
        user_id: id,
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
            <div
              className="h-full transition-all duration-500 ease-in-out bg-blue-500 rounded-full"
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>
          <div className="p-8 bg-white rounded-lg shadow-md w-96">
            <h2 className="mb-4 text-2xl font-semibold text-center">
              {questions[currentQuestion].question}
            </h2>
            <div className="flex flex-col gap-4">
              {questions[currentQuestion].options &&
                questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none"
                    onClick={() => handleNext(option)}
                  >
                    {option}
                  </button>
                ))}
              {questions[currentQuestion].type === "text" && (
                <>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Type your thoughts here..."
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none"
                    onClick={() => handleNext(additionalMessage)}
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h2 className="mb-4 text-2xl font-semibold text-center">
            Available Listeners
          </h2>
          <ul>
            {listeners.map((listener) => (
              <li
                key={listener.room_id}
                className="flex justify-between p-3 mb-2 bg-gray-200 rounded-lg"
              >
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
