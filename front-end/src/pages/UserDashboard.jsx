import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const username = user?.user?.username || "User";
  const navigate = useNavigate();

  // Start Session logic (replace with your actual logic if needed)
  const handleStartSession = () => {
    // Your chat/session logic here
    navigate("/preview");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full px-4 py-8" style={{ fontFamily: 'Epilogue, sans-serif' }}>
      <div className="w-full max-w-5xl mx-auto">
        {/* Desktop: Two-column layout, Mobile: Stacked */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-10 mb-8">
          {/* Left column: Welcome, focus, progress, quick actions */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left mt-2">Welcome back, {username}</h1>
            <div className="text-center md:text-left w-full">
              <div className="text-base font-medium text-gray-500 mb-1">Today's Focus</div>
              <div className="text-lg font-normal text-gray-700 mb-0.5">Mindfulness</div>
              <div className="text-lg font-bold text-gray-900 mb-1">Morning Meditation</div>
              <div className="text-sm text-gray-400">Start your day with a 10–minute guided meditation.</div>
            </div>
            {/* Progress Card */}
            <div className="mb-8">
              <div className="font-semibold text-lg mb-3 md:mb-2">Your Progress</div>
              {/* Mobile: stacked card */}
              <div className="block md:hidden">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-0 overflow-hidden w-full max-w-md mx-auto">
                  <div className="flex flex-col divide-y divide-gray-200">
                    <div className="flex items-center justify-between px-6 py-5">
                      <span className="text-gray-500 text-base">Days Active</span>
                      <span className="text-2xl font-bold">14</span>
                    </div>
                    <div className="flex items-center justify-between px-6 py-5">
                      <span className="text-gray-500 text-base">Sessions Completed</span>
                      <span className="text-2xl font-bold">28</span>
                    </div>
                    <div className="flex items-center justify-between px-6 py-5">
                      <span className="text-gray-500 text-base">Average Mood</span>
                      <span className="text-2xl font-bold">7.5</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Desktop: 3-column grid */}
              <div className="hidden md:grid md:grid-cols-3 md:gap-4">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 flex flex-col items-start">
                  <span className="text-gray-500 text-base mb-1">Days Active</span>
                  <span className="text-2xl font-bold">14</span>
                </div>
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 flex flex-col items-start">
                  <span className="text-gray-500 text-base mb-1">Sessions Completed</span>
                  <span className="text-2xl font-bold">28</span>
                </div>
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 flex flex-col items-start">
                  <span className="text-gray-500 text-base mb-1">Average Mood</span>
                  <span className="text-2xl font-bold">7.5</span>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="mb-8 max-w-md md:max-w-lg w-full">
              <div className="font-semibold text-lg mb-3">Quick Actions</div>
              {/* Mobile: stacked buttons */}
              <div className="flex flex-col gap-4 md:hidden">
                <button
                  className="w-full bg-[#e5e8ef] text-gray-900 font-semibold rounded-full px-5 py-3 shadow-sm hover:bg-[#d3e3ed] transition text-base"
                  onClick={handleStartSession}
                >
                  Start Session
                </button>
                <button 
                  className="w-full bg-[#e5e8ef] text-gray-900 font-semibold rounded-full px-5 py-3 shadow-sm hover:bg-[#d3e3ed] transition text-base"
                  onClick={() => navigate("/journal")}
                >Journal Entry</button>
              </div>
              {/* Desktop: row buttons at ends */}
              <div className="hidden md:flex flex-row w-full justify-between gap-4">
                <button
                  className="bg-[#e5e8ef] text-gray-900 font-semibold rounded-full px-8 py-3 shadow-sm hover:bg-[#d3e3ed] transition text-base"
                  onClick={handleStartSession}
                >
                  Start Session
                </button>
                <button onClick={() => navigate("/journal")} className="bg-[#e5e8ef] text-gray-900 font-semibold rounded-full px-8 py-3 shadow-sm hover:bg-[#d3e3ed] transition text-base">Journal Entry</button>
              </div>
            </div>
          </div>
          {/* Right column: Focus image (desktop only) */}
          <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0 w-[340px] mt-8 md:mt-0">
            <img src="/a1.png" alt="Focus" className="w-full h-40 object-cover rounded-xl shadow" />
          </div>
        </div>
        {/* Recommended for You - Carousel on mobile, grid on desktop */}
        <div className="mb-4">
          <div className="font-semibold text-lg mb-3">Recommended for You</div>
          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
            <div className="bg-white rounded-xl flex-shrink-0 flex flex-col items-center overflow-hidden w-64 sm:w-auto">
              <img src="/a2.png" alt="Yoga" className="w-full h-40 object-cover rounded-t-xl" />
              <div className="font-semibold mb-1 mt-3">Yoga for Relaxation</div>
              <div className="text-gray-500 text-sm mb-3">30 minutes</div>
            </div>
            <div className="bg-white rounded-xl flex-shrink-0 flex flex-col items-center overflow-hidden w-64 sm:w-auto">
              <img src="/a3.png" alt="Nature Walk" className="w-full h-40 object-cover rounded-t-xl" />
              <div className="font-semibold mb-1 mt-3">Nature Walk</div>
              <div className="text-gray-500 text-sm mb-3">45 minutes</div>
            </div>
            <div className="bg-white rounded-xl flex-shrink-0 flex flex-col items-center overflow-hidden w-64 sm:w-auto">
              <img src="/a4.png" alt="Reading" className="w-full h-40 object-cover rounded-t-xl" />
              <div className="font-semibold mb-1 mt-3">Reading for Calm</div>
              <div className="text-gray-500 text-sm mb-3">60 minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
