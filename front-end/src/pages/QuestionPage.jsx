import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    {
      question: "What is your age?",
      options: ["14-18", "19-21", "22-26", "27+"],
    },
    {
      question: "What gender do you idetify with?",
      options: ["Woman", "Man", "Prefer not to say"],
    },
    {
      question: "What is the main issue you would like to address?",
      options: ["Anxiety", "Depression", "Relationship Stress", "Social Anxiety","Loneliness","Family Stress"],
    },
  ];
  const navigate = useNavigate();
  const progressBarWidth = (currentQuestion / questions.length) * 100;

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
        navigate('/chat');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              onClick={nextQuestion}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;