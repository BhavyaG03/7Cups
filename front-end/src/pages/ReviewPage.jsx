import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const role = user.role;
  const { listener_id, user_id, room_id } = location.state;

  const [experience, setExperience] = useState(5);
  const [helpful, setHelpful] = useState(true);
  const [reason, setReason] = useState("");

  const [speakerBehavior, setSpeakerBehavior] = useState("Genuine");
  const [inappropriateDetails, setInappropriateDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (role === "user") {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/user/feedback`, {
          room_id,
          listener_id,
          user_id,
          overall_experience: experience,
          was_helpful: helpful,
          unhelpful_details: helpful === false ? reason : "",
        });
        navigate("/user/dashboard");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/listener/feedback`, {
          room_id,
          listener_id,
          user_id,
          overall_experience: experience,
          speaker_behavior: speakerBehavior,
          inappropriate_details: speakerBehavior === "Inappropriate" ? inappropriateDetails : "",
        });
        navigate("/listener/dashboard");
      }

      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ fontFamily: 'Epilogue, sans-serif' }}>
      <div className="w-full max-w-md sm:p-6 px-3 sm:bg-white sm:rounded-xl sm:shadow-md mx-2">
        {/* Top image with overlay */}
        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6">
          <img src="/review.png" alt="Decor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-start p-6">
            <h2 className="text-white text-2xl font-bold">Chat Feedback</h2>
            <p className="text-white mb-4 text-base">We'd love to hear about your experience. Your feedback helps us improve.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B89A6] text-base font-medium">
            <option disabled>Rate your overall experience (1-5 stars)</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
          {role === "user" ? (
            <>
              <select 
                value={helpful} 
                onChange={(e) => setHelpful(e.target.value === "true" ? true : false)}
                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B89A6] text-base font-medium"
              >
                <option disabled>Was the conversation helpful?</option>
                <option value="true">Helpful</option>
                <option value="false">Unhelpful</option>
              </select>
              {helpful === false && (
                <textarea
                  placeholder="Please provide details (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B89A6] text-base font-medium min-h-[96px]"
                />
              )}
            </>
          ) : (
            <>
              <select value={speakerBehavior} onChange={(e) => setSpeakerBehavior(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B89A6] text-base font-medium">
                <option disabled>Speaker behavior</option>
                <option value="Genuine">Genuine</option>
                <option value="Just passing time">Just Passing Time</option>
                <option value="Inappropriate">Inappropriate</option>
              </select>
              {speakerBehavior === "Inappropriate" && (
                <textarea
                  placeholder="Please provide details (optional)"
                  value={inappropriateDetails}
                  onChange={(e) => setInappropriateDetails(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B89A6] text-base font-medium min-h-[96px]"
                />
              )}
            </>
          )}
          <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-[#8B89A6] text-white font-semibold text-lg transition-colors hover:bg-[#726f8a] focus:outline-none focus:ring-2 focus:ring-[#8B89A6]">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
