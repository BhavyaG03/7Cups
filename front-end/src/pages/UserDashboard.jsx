import React from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

const UserDashboard = () => {
  // Get user from sessionStorage
  const user = (() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  })();
  const username = user?.username || "User";
  const navigate = useNavigate();

  // Start Session logic (replace with your actual logic if needed)
  const handleStartSession = () => {
    // Your chat/session logic here
    navigate("/preview");
  };

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      <Header />
      <div className="min-h-screen bg-white w-full px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Desktop: Two-column layout, Mobile: Stacked */}
          <div className="flex flex-col md:flex-row md:items-start md:gap-10 mb-8">
            {/* Left column: Welcome, focus, progress, quick actions */}
            <div className="flex-1 flex flex-col gap-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left mt-2">Welcome back, {username}</h1>
              
              {/* Progress Card */}
              
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
    </div>
  );
};

export default UserDashboard;
