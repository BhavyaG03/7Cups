import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosHeartEmpty } from "react-icons/io";
import { PiChatTeardropDots, PiUser, PiUsers } from "react-icons/pi";
import { FaHeart, FaUserFriends } from "react-icons/fa";


const IndexPage = () => {
  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 sm:px-10 py-5 bg-white shadow-sm">
        <div className="text-xl font-bold tracking-tight">Mindfree</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded-lg font-medium text-[#18162B] border border-[#18162B] hover:bg-[#f5f5f5] transition">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg font-medium text-white bg-[#18162B] hover:bg-[#23204a] transition">Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center px-2 sm:px-0 mt-6">
        {/* Mobile Hero */}
        <div className="w-full sm:hidden rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full h-[420px]">
            <img src="/m.png" alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-black bg-opacity-30">
              <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Find Your Support System</h1>
              <p className="text-white text-base mb-6 max-w-md drop-shadow">Connect with others who understand. Share your experiences, find support, and build meaningful connections within our supportive community.</p>
              <button className="px-6 py-3 rounded-full bg-[#6C6A8A] text-white font-semibold shadow hover:bg-[#57557a] transition">Explore Community</button>
            </div>
          </div>
        </div>
        {/* Desktop Hero */}
        <div className="w-full max-w-[1100px] hidden sm:block rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full h-64 sm:h-96">
            <img src="/valley.png" alt="Mountains" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">Find Your Support System</h1>
              <p className="text-white text-base sm:text-lg mb-6 max-w-2xl">Connect with others who understand your journey, share experiences, gain insights, and build lasting connections in a safe and supportive environment.</p>
              <button className="px-6 py-3 rounded-full bg-white text-[#18162B] font-semibold shadow hover:bg-gray-100 transition">Explore Community</button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full max-w-[1100px] mx-auto mt-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why Choose Mindfree?</h2>
        <p className="text-gray-600 mb-8">Our platform is designed to foster genuine connections and provide valuable support for your mental health journey.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-5 flex flex-col items-start shadow-sm">
            <div className="mb-2"><span className=""><PiUsers size={24}></PiUsers></span></div>
            <div className="font-semibold mb-1">Connect with Peers</div>
            <div className="text-gray-500 text-sm">Join groups based on shared experiences and interests. Find others who understand what you're going through.</div>
          </div>
          <div className="bg-white border rounded-xl p-5 flex flex-col items-start shadow-sm">
            <div className="mb-2"><span className=""><PiChatTeardropDots size={24}></PiChatTeardropDots></span></div>
            <div className="font-semibold mb-1">Engage in Meaningful Discussions</div>
            <div className="text-gray-500 text-sm">Participate in discussions, share your story, and learn from others in a respectful and understanding community.</div>
          </div>
          <div className="bg-white border rounded-xl p-5 flex flex-col items-start shadow-sm">
            <div className="mb-2"><span className=""><IoIosHeartEmpty size={24}></IoIosHeartEmpty></span></div>
            <div className="font-semibold mb-1">Find Encouragement</div>
            <div className="text-gray-500 text-sm">Receive and offer support, encouragement, and positive reinforcement to help each other through challenging times.</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1100px] mx-auto mt-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">More Than Just a Platform</h2>
        <p className="text-gray-600 mb-8">Explore the features that make our platform a unique space for mental health support and community engagement.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-row sm:flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/i1.png" alt="Community Groups" className="w-24 h-24 object-cover rounded-lg m-4 sm:w-full sm:h-40 sm:rounded-t-xl sm:rounded-b-none sm:m-0" />
            <div className="flex-1 p-5 flex flex-col justify-center sm:items-center sm:text-center">
              <div className="font-semibold mb-1">Diverse Community Groups</div>
              <div className="text-gray-500 text-sm">Explore a wide range of groups covering various mental health topics, interests, and demographics.</div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-row sm:flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/i2.png" alt="Mindfulness Resources" className="w-24 h-24 object-cover rounded-lg m-4 sm:w-full sm:h-40 sm:rounded-t-xl sm:rounded-b-none sm:m-0" />
            <div className="flex-1 p-5 flex flex-col justify-center sm:items-center sm:text-center">
              <div className="font-semibold mb-1">Mindfulness Resources</div>
              <div className="text-gray-500 text-sm">Access guided meditations, articles, and other resources to support your mindfulness practice and overall well-being.</div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-row sm:flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/i3.png" alt="Peer Support Network" className="w-24 h-24 object-cover rounded-lg m-4 sm:w-full sm:h-40 sm:rounded-t-xl sm:rounded-b-none sm:m-0" />
            <div className="flex-1 p-5 flex flex-col justify-center sm:items-center sm:text-center">
              <div className="font-semibold mb-1">Peer Support Network</div>
              <div className="text-gray-500 text-sm">Connect with trained peer supporters who can offer guidance and understanding based on their own experiences.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of Joining Section */}
      <section className="w-full max-w-[1100px] mx-auto mt-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Benefits of Joining</h2>
        <p className="text-gray-600 mb-8">Joining Mindful Space can provide numerous benefits for your mental health and well-being. Our community-driven approach offers a unique blend of support, education, and personal development.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/c1.png" alt="Find Understanding and Support" className="w-full h-40 object-cover rounded-t-xl" />
            <div className="flex-1 p-5 flex flex-col items-center text-center">
              <div className="font-semibold mb-1">Find Understanding and Support</div>
              <div className="text-gray-500 text-sm">Connect with others who understand your experiences and can offer valuable support and encouragement.</div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/c2.png" alt="Improve Your Mental Well-being" className="w-full h-40 object-cover rounded-t-xl" />
            <div className="flex-1 p-5 flex flex-col items-center text-center">
              <div className="font-semibold mb-1">Improve Your Mental Well-being</div>
              <div className="text-gray-500 text-sm">Engage in activities and discussions that promote mindfulness, stress reduction, and emotional resilience.</div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/c3.png" alt="Track Your Progress" className="w-full h-40 object-cover rounded-t-xl" />
            <div className="flex-1 p-5 flex flex-col items-center text-center">
              <div className="font-semibold mb-1">Track Your Progress</div>
              <div className="text-gray-500 text-sm">Utilize our tools to track your mood, set goals, and monitor your progress over time.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full flex flex-col items-center mt-16 mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Ready to Start Your Journey?</h2>
        <button className="px-8 py-3 rounded-full bg-[#e7d7c6] text-[#18162B] font-semibold shadow hover:bg-[#e0cbb3] transition">Join Mindfree Today</button>
      </section>
    </div>
  );
};

export default IndexPage;
