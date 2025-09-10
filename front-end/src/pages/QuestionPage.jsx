import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from '../components/Header';

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

function QuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(() => {
    // Try to get saved responses from sessionStorage
    const savedResponses = sessionStorage.getItem("questionResponses");
    return savedResponses ? JSON.parse(savedResponses) : {};
  });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showListeners, setShowListeners] = useState(() => {
    // Check if we were already showing listeners before reload
    return sessionStorage.getItem("showingListeners") === "true";
  });
  const [listeners, setListeners] = useState([]);
  const [additionalMessage, setAdditionalMessage] = useState(() => {
    // Try to get saved additional message from sessionStorage
    return sessionStorage.getItem("additionalMessage") || "";
  });
  // Replace useSelector with sessionStorage
  const user = (() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  })();
  const id = user?.id;
  const username = user?.username;
  const role = user?.role;
  const [listenerStatuses, setListenerStatuses] = useState({});

  const questions = [
    {
      key: "feelings",
      question: "How do you feel right now? (Select all that apply)",
      options: [
        "Worried about my future/career",
        "Stressed with studies/workload",
        "Anxious in social situations or friendships",
        "Stressed by family expectations",
        "Struggling with relationships or feeling lonely",
        "Not feeling confident about myself",

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
        "I just want to vent and express myself", 
        "I want to feel heard and not alone", 
        "I'm not sure, I just need to talk",

      ],
    },
  ];

  const navigate = useNavigate();
  const progressBarWidth = ((currentQuestion + 1) / questions.length) * 100;
  useEffect(() => {
    // If we're showing listeners (either from state or restored from sessionStorage)
    if (showListeners) {
      fetchListeners();
      
      // Set up polling to refresh listeners list every 5 seconds
      const intervalId = setInterval(() => {
        fetchListeners();
      }, 5000);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
    
    // Restore current question position based on saved responses
    const savedResponses = sessionStorage.getItem("questionResponses");
    if (savedResponses) {
      const parsedResponses = JSON.parse(savedResponses);
      const answeredQuestions = Object.keys(parsedResponses).length;
      
      // If user has answered some questions but not all, set current question accordingly
      if (answeredQuestions > 0 && answeredQuestions < questions.length && !showListeners) {
        // Find the index of the next unanswered question
        let nextQuestionIndex = 0;
        for (let i = 0; i < questions.length; i++) {
          if (!parsedResponses[questions[i].key]) {
            nextQuestionIndex = i;
            break;
          }
        }
        setCurrentQuestion(nextQuestionIndex);
      }
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
      
      // Save responses to sessionStorage
      sessionStorage.setItem("questionResponses", JSON.stringify(updatedResponses));

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
      // Save that we're showing listeners now
      sessionStorage.setItem("showingListeners", "true");
    } catch (error) {
      console.error("Error storing responses:", error);
    }
  };

  const fetchListeners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users?status=online&role=listener`
      );
      setListeners(response.data);
      setShowListeners(true);
      // Save that we're showing listeners now
      sessionStorage.setItem("showingListeners", "true");
      // Fetch status for each listener
      const statuses = {};
      await Promise.all(response.data.map(async (listener) => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/status/${listener._id}`);
          statuses[listener._id] = res.data;
        } catch {}
      }));
      setListenerStatuses(statuses);
    } catch (error) {
      console.error("Error fetching listeners:", error);
    }
  };

  const handleJoinChat = async (listenerRoomId, listenerId) => {
    try {
      if (!id) {
        console.error("User ID not found.");
        return;
      }
      await axios.put(`${import.meta.env.VITE_API_URL}/api/chats/${listenerRoomId}`, {
        user_id: id,
      });

      // Clear saved responses when joining chat
      // This ensures a fresh start when user returns to questions page
      sessionStorage.removeItem("questionResponses");
      sessionStorage.removeItem("showingListeners");
      sessionStorage.removeItem("additionalMessage");

      navigate(`/chat`, { state: { room_id: listenerRoomId, listenerId: listenerId, userId: id } });
    } catch (error) {
      console.error("Error updating user room:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="min-h-screen bg-white">
      <Header />
      {!showListeners ? (
        <div className="flex flex-col items-center px-2 pb-10 w-full min-h-screen bg-white sm:px-0">
          <h1 className="px-2 pt-8 mb-8 text-2xl font-bold text-center sm:text-3xl">Help us get to know you</h1>
          <div className="mx-auto mb-10 w-full max-w-md h-2 bg-gray-200 rounded-full sm:max-w-xl">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>
          <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-md bg-white rounded-xl shadow-md sm:max-w-2xl sm:p-12">
            <h2 className="mb-6 text-xl font-semibold text-center sm:text-2xl">
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
                  className={`px-4 py-3 font-bold rounded-xl focus:outline-none w-full mt-2 text-sm sm:text-base transition-all ${
                    selectedOptions.length > 0 
                      ? "bg-blue-600 text-white hover:bg-blue-800" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => selectedOptions.length > 0 && handleNext(selectedOptions)}
                  disabled={selectedOptions.length === 0}
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
                    onChange={(e) => {
                      setAdditionalMessage(e.target.value);
                      // Save additional message to sessionStorage
                      sessionStorage.setItem("additionalMessage", e.target.value);
                    }}
                  />
                  <button
                    className="px-4 py-3 mt-2 w-full text-sm font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-700 focus:outline-none sm:text-base"
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
        <div className="flex flex-col items-center px-2 py-10 w-full min-h-screen bg-white sm:px-0">
          <div className="px-2 mx-auto w-full max-w-4xl sm:px-0">
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Find Your Listener</h1>
            <p className="mb-6 text-gray-500">Based on your responses, we've matched you with listeners who can provide support.</p>
            {/* Sleek Search Bar */}
            <div className="mb-8">
              <div className="flex items-center bg-[#f1f4f8] rounded-lg px-3 py-2 w-full max-w-xl border border-gray-200">
                <svg className="mr-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" className="w-full text-base placeholder-gray-400 text-gray-700 bg-transparent border-none outline-none" placeholder="Search for listeners" disabled />
              </div>
            </div>
            {/* Available Now */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Available Now</h2>
              <div className="flex flex-col gap-6">
                {listeners.length === 0 ? (
                  <div className="py-8 text-lg font-medium text-center text-gray-500">No listeners are available at the moment. Please check back soon!</div>
                ) : (
                  listeners.map((listener, idx) => {
                    // Assign a random specialty and avatar for each listener
                    const specialty = SPECIALTIES[idx % SPECIALTIES.length];
                    const avatar = AVATARS[idx % AVATARS.length];
                    return (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0" key={listener.room_id || listener.username}>
                        <div className="flex flex-1 items-center">
                          <img src={avatar} alt={listener.username} className="object-cover mr-3 w-14 h-14 rounded-full sm:mr-4" />
                          <div>
                            <div className="text-base font-semibold sm:text-lg">{listener.username}</div>
                            <div className="text-xs text-gray-500 sm:text-sm">
                              {listenerStatuses[listener._id]?.status === 'online'
                                ? 'Online'
                                : listenerStatuses[listener._id]?.lastSeen
                                  ? `Last seen ${formatLastSeen(listenerStatuses[listener._id].lastSeen)}`
                                  : 'Status unknown'}
                            </div>
                            <div className="text-xs text-gray-400 sm:text-sm">{specialty}</div>
                          </div>
                        </div>
                        <button onClick={() => handleJoinChat(listener.room_id, listener._id)}
 className="w-auto mx-auto sm:ml-4 px-3 sm:px-3 py-1.5 sm:py-2 bg-gray-100 rounded-lg sm:rounded-full text-gray-700 font-normal text-sm sm:text-base hover:bg-gray-200 transition shadow-sm border border-gray-200 mt-2 sm:mt-0 mb-2 sm:mb-0">Connect</button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* Explore Listener Categories */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Explore Listener Categories</h2>
              <div className="grid gap-6 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {/* Card 1 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full h-full min-h-[220px] flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/><path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg></span>
                  <div className="mb-1 font-semibold whitespace-normal break-words">Relationship Support</div>
                  <div className="text-sm text-gray-500 whitespace-normal break-words">Find listeners specializing in relationship advice.</div>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full max-w-sm sm:max-w-md sm:min-w-[320px] mx-auto flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
                  <div className="mb-1 font-semibold">Emotional Wellness</div>
                  <div className="text-sm text-gray-500">Connect with listeners focused on emotional well-being.</div>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full max-w-sm sm:max-w-md sm:min-w-[320px] mx-auto flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg></span>
                  <div className="mb-1 font-semibold">Career Guidance</div>
                  <div className="text-sm text-gray-500">Get support from listeners experienced in career challenges.</div>
                </div>
                {/* Card 4 */}
                <div className="bg-white rounded-xl border p-5 sm:p-7 w-full max-w-sm sm:max-w-md sm:min-w-[320px] mx-auto flex flex-col items-start">
                  <span className="mb-3"><svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span>
                  <div className="mb-1 font-semibold">Mindfulness Practices</div>
                  <div className="text-sm text-gray-500">Explore mindfulness techniques with experienced listeners.</div>
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
