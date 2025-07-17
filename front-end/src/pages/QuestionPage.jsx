import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// List of specialties and avatar images for random assignment
const SPECIALTIES = [
  "Specializes in anxiety and stress management",
  "Experienced in relationship issues and self-esteem",
  "Focuses on emotional wellness and mindfulness",
  "Expert in career guidance and workplace stress",
  "Helps with family and social challenges",
  "Supportive in grief and loss situations",
  "Guides through academic and student life issues"
];
const AVATARS = [
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/41.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg"
];

function QuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
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
        "I want to feel less alone in what I am going through.",
        "I don't know, I just need to talk.",
      ],
    },
  ];

  const navigate = useNavigate();
  const progressBarWidth = ((currentQuestion + 1) / questions.length) * 100;
  useEffect(() => {
    if (showListeners) {
      fetchListeners();
    }
  }, [showListeners]); 

  const handleOptionClick = (option) => {
    const currentQ = questions[currentQuestion];

    if (currentQ.multiple) {
      setSelectedOptions((prev) => {
        const newSelection = prev.includes(option)
          ? prev.filter((opt) => opt !== option)
          : [...prev, option];

        return newSelection;
      });
    } else {
      handleNext(option);
    }
  };

  const handleNext = (answer) => {
    const currentQ = questions[currentQuestion];

    setResponses((prevResponses) => {
      const updatedResponses = { ...prevResponses, [currentQ.key]: answer };

      if (currentQuestion === questions.length - 1) {
        storeResponses(updatedResponses);
      }

      return updatedResponses;
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
    }
  };

  const storeResponses = async (finalResponses) => {
    try {
      const payload = {
        userId: id,
        responses: Object.keys(finalResponses).map((key) => ({
          question: questions.find((q) => q.key === key)?.question || key,
          answer: finalResponses[key],
        })),
        additionalNotes: finalResponses.additional || "",
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/responses`, payload);
      setShowListeners(true);
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
        <div className="w-full px-2 sm:px-0 flex flex-col items-center min-h-screen bg-gray-100 pb-10">
          <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-center px-2 pt-8">Help us get to know you</h1>
          <div className="h-2 mb-10 bg-gray-200 rounded-full w-full max-w-md sm:max-w-xl mx-auto">
            <div
              className="h-full transition-all duration-500 ease-in-out bg-blue-500 rounded-full"
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>
          <div className="w-full max-w-md sm:max-w-2xl mx-auto p-6 sm:p-12 bg-white rounded-xl shadow-md flex flex-col gap-8">
            <h2 className="mb-6 text-xl sm:text-2xl font-semibold text-center">
              {questions[currentQuestion].question}
            </h2>
            <div
              className={`${
                currentQuestion === 0 ? "grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6" : "flex flex-col gap-4 sm:gap-6 justify-center items-center w-full"
              }`}
            >
              {questions[currentQuestion].options &&
                questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`px-4 w-full py-3 font-semibold rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                      selectedOptions.includes(option) ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </button>
                ))}

              {questions[currentQuestion].multiple && (
                <button
                  className="px-4 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-800 focus:outline-none w-full mt-2 text-sm sm:text-base"
                  onClick={() => handleNext(selectedOptions)}
                >
                  Continue
                </button>
              )}

              {questions[currentQuestion].type === "text" && (
                <>
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-xl min-h-[100px] text-sm sm:text-base mb-2"
                    placeholder="Type your thoughts here..."
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                  />
                  <button
                    className="px-4 py-3 font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-700 focus:outline-none w-full mt-2 text-sm sm:text-base"
                    onClick={() => handleNext(additionalMessage)}
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-[#f7fafd] flex flex-col items-center px-2 sm:px-0 py-10">
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Find Your Listener</h1>
            <p className="text-gray-500 mb-6">Based on your responses, we've matched you with listeners who can provide support.</p>
            {/* Sleek Search Bar */}
            <div className="mb-8">
              <div className="flex items-center bg-[#f1f4f8] rounded-lg px-3 py-2 w-full max-w-xl border border-gray-200">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" className="bg-transparent outline-none border-none w-full text-gray-700 placeholder-gray-400 text-base" placeholder="Search for listeners" disabled />
              </div>
            </div>
            {/* Available Now */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Available Now</h2>
              <div className="flex flex-col gap-6">
                {listeners.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 text-lg font-medium">No listeners are available at the moment. Please check back soon!</div>
                ) : (
                  listeners.map((listener, idx) => {
                    // Assign a random specialty and avatar for each listener
                    const specialty = SPECIALTIES[idx % SPECIALTIES.length];
                    const avatar = AVATARS[idx % AVATARS.length];
                    return (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0" key={listener.room_id || listener.username}>
                        <div className="flex items-center flex-1">
                          <img src={avatar} alt={listener.username} className="w-14 h-14 rounded-full object-cover mr-3 sm:mr-4" />
                          <div>
                            <div className="font-semibold text-base sm:text-lg">{listener.username}</div>
                            <div className="text-gray-500 text-xs sm:text-sm">Available for a chat</div>
                            <div className="text-gray-400 text-xs sm:text-sm">{specialty}</div>
                          </div>
                        </div>
                        <button onClick={() => handleJoinChat(listener.room_id)}
 className="w-auto mx-auto sm:ml-4 px-3 sm:px-3 py-1.5 sm:py-2 bg-gray-100 rounded-lg sm:rounded-full text-gray-700 font-normal text-sm sm:text-base hover:bg-gray-200 transition shadow-sm border border-gray-200 mt-2 sm:mt-0 mb-2 sm:mb-0">Connect</button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* Explore Listener Categories */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Explore Listener Categories</h2>
              <div className="grid gap-6 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {/* Card 1 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full h-full min-h-[220px] flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/><path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg></span>
                  <div className="font-semibold mb-1 break-words whitespace-normal">Relationship Support</div>
                  <div className="text-gray-500 text-sm break-words whitespace-normal">Find listeners specializing in relationship advice.</div>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full max-w-sm sm:max-w-md sm:min-w-[320px] mx-auto flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
                  <div className="font-semibold mb-1">Emotional Wellness</div>
                  <div className="text-gray-500 text-sm">Connect with listeners focused on emotional well-being.</div>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full max-w-sm sm:max-w-md sm:min-w-[320px] mx-auto flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg></span>
                  <div className="font-semibold mb-1">Career Guidance</div>
                  <div className="text-gray-500 text-sm">Get support from listeners experienced in career challenges.</div>
                </div>
                {/* Card 4 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full max-w-sm sm:max-w-md sm:min-w-[320px] mx-auto flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span>
                  <div className="font-semibold mb-1">Mindfulness Practices</div>
                  <div className="text-gray-500 text-sm">Explore mindfulness techniques with experienced listeners.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;
