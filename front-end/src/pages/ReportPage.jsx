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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Report User</h2>
        <p className="mt-2 text-center text-gray-600">
          Please select a reason for reporting this user.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {reasons.map((reason, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-5 h-5 text-red-500"
              />
              <span>{reason}</span>
            </label>
          ))}

          {selectedReason === "Other" && (
            <textarea
              placeholder="Provide more details..."
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportPage;
