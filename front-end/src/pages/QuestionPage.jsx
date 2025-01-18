import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuestionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    {
      question: "What is your relationship status?",
      options: ["Single", "In a Relationship", "Married", "Divorced"],
    },
    {
      question: "Which country do you live in?",
      options: ["USA", "Canada", "UK", "India"],
    },
    {
      question: "Do you consider yourself to be religious or spiritual?",
      options: ["Yes", "No", "Prefer not to say", "Spiritual but not religious"],
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
      <h1 className="text-3xl font-bold mb-8">Help us get to know you</h1>

      <div className="w-96 bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressBarWidth}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {questions[currentQuestion].question}
        </h2>
        <div className="flex flex-col gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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