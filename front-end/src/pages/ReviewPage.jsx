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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Chat Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <label className="block font-semibold">Rate the overall experience</label>
          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>

          {role === "user" ? (
            <>
              <label className="block font-semibold">Was the conversation helpful?</label>
<select 
  value={helpful} 
  onChange={(e) => setHelpful(e.target.value === "true" ? true : false)}
  className="w-full p-2 border border-gray-300 rounded"
>
  <option value="true">Helpful</option>
  <option value="false">Unhelpful</option>
</select>


              {helpful === false && (
                <textarea
                  placeholder="Provide details..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              )}
            </>
          ) : (
            <>
              <label className="block font-semibold">Was the speaker genuine?</label>
              <select value={speakerBehavior} onChange={(e) => setSpeakerBehavior(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                <option value="Genuine">Genuine</option>
                <option value="Just Passing Time">Just Passing Time</option>
                <option value="Inappropriate">Inappropriate</option>
              </select>

              {speakerBehavior === "Inappropriate" && (
                <textarea
                  placeholder="Provide details..."
                  value={inappropriateDetails}
                  onChange={(e) => setInappropriateDetails(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              )}
            </>
          )}

          <button type="submit" className="w-full p-3 text-white bg-blue-600 rounded">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
