import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const reasons = [
  "Inappropriate language or behavior",
  "Harassment or abuse",
  "Unrelated or irrelevant conversation",
  "Spam or disruptive behavior",
  "Other",
];

function ReportPage() {
  const user = useSelector((state) => state.user.user);
  const role=user.role;
  const location = useLocation();
  const navigate = useNavigate();
  const { reported_by, room_id, reported_person } = location.state || {};

  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReason) {
      alert("Please select a reason for reporting.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reports`, {
        reported_by,
        reported_person,
        room_id,
        reason: selectedReason,
        description: selectedReason === "Other" ? description : "",
      });

      alert("Report submitted successfully.");
      if (role==="user") {
        navigate("/user/dashboard");
      } else {
        navigate("/listener/dashboard");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ fontFamily: 'Epilogue, sans-serif' }}>
      <div className="w-full max-w-md sm:p-6 px-3 sm:bg-white sm:rounded-xl sm:shadow-md mx-2">
        <h2 className="text-2xl font-bold text-center mb-3">Report User</h2>
        <p className="text-center text-gray-600 mb-6">
          Please select a reason for reporting this user.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {reasons.map((reason, index) => (
            <label
              key={index}
              className={`flex items-center px-4 py-3 rounded-xl border transition-colors cursor-pointer text-base font-medium ${selectedReason === reason ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-200'} focus-within:border-gray-400`}
            >
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="accent-gray-700 w-5 h-5 mr-3 focus:ring-2 focus:ring-gray-400"
              />
              <span className="flex-1">{reason}</span>
            </label>
          ))}
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-gray-500 text-white font-semibold text-lg transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportPage;
