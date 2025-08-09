import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosHeartEmpty } from "react-icons/io";
import { PiChatTeardropDots, PiUser, PiUsers } from "react-icons/pi";
import { FaHeart, FaUserFriends } from "react-icons/fa";
import Header from '../components/Header';

const IndexPage = () => {
  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center px-2 sm:px-0 mt-6">
        {/* Mobile Hero */}
        <div className="w-full sm:hidden rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full h-[420px]">
            <img src="/m.png" alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-black bg-opacity-30">
              <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">We are here to hear</h1>
              <p className="text-white text-base mb-6 max-w-md drop-shadow">Connect with empathetic, trained individuals who are here to listen to what's disturbing you and help you feel better.</p>
              <Link to="/login"><button className="px-6 py-3 rounded-full bg-[#6C6A8A] text-white font-semibold shadow hover:bg-[#57557a] transition">Get Started</button></Link>
            </div>
          </div>
        </div>
        {/* Desktop Hero */}
        <div className="w-full max-w-[1100px] hidden sm:block rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full h-64 sm:h-96">
            <img src="/valley.png" alt="Mountains" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">We are here to hear</h1>
              <p className="text-white text-base sm:text-lg mb-6 max-w-2xl">Connect with empathetic, trained individuals who are here to listen to what's disturbing you and help you feel better.</p>
              <Link to="/login"><button className="px-6 py-3 rounded-full bg-white text-[#18162B] font-semibold shadow hover:bg-gray-100 transition">Get Started</button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full max-w-[1100px] mx-auto mt-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why Choose MindFree?</h2>
        <p className="text-gray-600 mb-8">Something on your mind that is bothering you?
        You know, talking to someone about what's bothering you helps feel more calm and centered.</p>
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/login"><div className="bg-white border rounded-xl p-5 flex flex-col items-start shadow-sm">
            <div className="mb-2"><span className=""><PiUsers size={24}></PiUsers></span></div>
            <div className="font-semibold mb-1">Connect with Peers</div>
            <div className="text-gray-500 text-sm">Join groups based on shared experiences and interests. Find others who understand what you're going through.</div>
          </div></Link>
          <Link to="/login"><div className="bg-white border rounded-xl p-5 flex flex-col items-start shadow-sm">
            <div className="mb-2"><span className=""><PiChatTeardropDots size={24}></PiChatTeardropDots></span></div>
            <div className="font-semibold mb-1">Engage in Meaningful Discussions</div>
            <div className="text-gray-500 text-sm">Participate in discussions, share your story, and learn from others in a respectful and understanding community.</div>
          </div></Link>
          <Link to="/login"><div className="bg-white border rounded-xl p-5 flex flex-col items-start shadow-sm">
            <div className="mb-2"><span className=""><IoIosHeartEmpty size={24}></IoIosHeartEmpty></span></div>
            <div className="font-semibold mb-1">Find Encouragement</div>
            <div className="text-gray-500 text-sm">Receive and offer support, encouragement, and positive reinforcement to help each other through challenging times.</div>
          </div></Link>
        </div> */}
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1100px] mx-auto mt-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Be Rest Assured</h2>
        <p className="text-gray-600 mb-8">Explore the features that make our platform a unique space for mental health support.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-row sm:flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/i1.png" alt="Community Groups" className="w-24 h-24 object-cover rounded-lg m-4 sm:w-full sm:h-40 sm:rounded-t-xl sm:rounded-b-none sm:m-0" />
            <div className="flex-1 p-5 flex flex-col justify-center sm:items-center sm:text-center">
              <div className="font-semibold mb-1">Listeners@Mindfree</div>
              <div className="text-gray-500 text-sm"> Our Listeners are empathetic, emotionally intelligent individuals who have been trained to help you share comfortably </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-row sm:flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/i2.png" alt="Mindfulness Resources" className="w-24 h-24 object-cover rounded-lg m-4 sm:w-full sm:h-40 sm:rounded-t-xl sm:rounded-b-none sm:m-0" />
            <div className="flex-1 p-5 flex flex-col justify-center sm:items-center sm:text-center">
              <div className="font-semibold mb-1">You deserve privacy</div>
              <div className="text-gray-500 text-sm">We don't store or view any chats, so you can share what's on your mind in total privacy </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-[#f8f6f2] rounded-xl shadow-sm flex flex-row sm:flex-col items-center p-0 overflow-hidden min-h-[120px]">
            <img src="/i3.png" alt="Peer Support Network" className="w-24 h-24 object-cover rounded-lg m-4 sm:w-full sm:h-40 sm:rounded-t-xl sm:rounded-b-none sm:m-0" />
            <div className="flex-1 p-5 flex flex-col justify-center sm:items-center sm:text-center">
              <div className="font-semibold mb-1">Your thoughts are safe with us</div>
              <div className="text-gray-500 text-sm">Your journal entries are stored in encrypted form so that no one but you can read your entries</div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Call to Action */}
      <section className="w-full flex flex-col items-center mt-16 mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Ready to Start Your Journey?</h2>
        <Link to="/login"><button className="px-8 py-3 rounded-full bg-[#e7d7c6] text-[#18162B] font-semibold shadow hover:bg-[#e0cbb3] transition">Join MindFree Today</button></Link>
      </section>
    </div>
  );
};

export default IndexPage;
