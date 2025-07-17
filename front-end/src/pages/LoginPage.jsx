import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

function LoginPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/users/login`, { email, password });

      // Save user data to Redux
      dispatch(loginSuccess(res.data));
      // Navigate based on user role
      if (res.data.role === "listener") {
        navigate("/listener/dashboard");
      } else if (res.data.role === "user") {
        navigate("/user/dashboard");
      } else {
        navigate("/preview");
      }

      alert("Logged in successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error logging in");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="flex flex-col items-center pt-12 pb-5 justify-center min-h-screen bg-white sm:bg-gray-50 px-4" style={{ fontFamily: 'Epilogue, sans-serif' }}>
      <div className="w-full max-w-md sm:max-w-xl bg-white rounded-2xl sm:shadow-md px-4 py-8 sm:px-8 sm:py-10 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-2xl">
            <div className="w-16 h-16 border-8 border-[#8B89A6] rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}
        <h2 className="text-center text-2xl font-bold mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[16px] font-medium text-gray-900 mb-1">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
              disabled={loading}
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[16px] font-medium text-gray-900 mb-1">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
              disabled={loading}
            />
          </div>
          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 text-[#8B89A6] border-gray-300 rounded focus:ring-[#8B89A6]"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-[#8B89A6] underline">Forgot Password?</a>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base mt-5 transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={loading}
          >
            Login
          </button>
        </form>
        {/* Register Redirect */}
        <p className="mt-6 text-center text-sm text-[#8B89A6]">
          Don't have an account?
        </p>
        <p className="text-center text-sm mb-2">
          <Link to='/register' className="text-[#8B89A6] underline">Sign Up</Link>
        </p>
        <p className="text-center text-xs text-[#8B89A6] mt-2">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      {/* Disclaimer Section */}
      <div className="w-full hidden max-w-2xl p-3 mt-4 text-xs text-gray-800 rounded-md shadow-md bg-white/10 backdrop-blur-xl">
        <h3 className="mb-1 text-sm font-semibold text-center text-gray-800">General Disclaimer</h3>
        <p className="leading-tight text-center">
          MindFree is an emotional well-being platform offering a safe space for open conversations. 
          Our volunteers are trained peers, not mental health professionals, and cannot diagnose, 
          treat, or provide medical advice.
          <br /><br />
          This is not a substitute for therapy or emergency services. If you're in crisis or need urgent help, 
          please contact a licensed professional or a crisis hotline.
          <br /><br />
          For your safety, do not share personal identification details on this platform.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
