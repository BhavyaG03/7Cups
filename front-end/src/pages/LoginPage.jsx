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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-500 to-gray-700">
  <div className="relative flex flex-col items-center w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg md:flex-row">
    {/* Loading Overlay */}
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
        <div className="w-16 h-16 border-8 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )}

    {/* Left Side with Image */}
    <div className="hidden w-1/2 md:block">
      <img
        src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7892.jpg?semt=ais_hybrid"
        alt="Login Visual"
        className="object-cover w-full h-full"
      />
    </div>

    {/* Right Side with Login Form */}
    <div className="w-full p-8 md:w-1/2">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
      <p className="mb-8 text-center text-gray-600">Login to your account and stay connected.</p>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <Link to='/register' className="text-blue-600 hover:underline">Sign Up</Link>
      </p>
    </div>
  </div>

  {/* Disclaimer Section */}
  <div className="w-full max-w-2xl p-3 mt-4 text-xs text-gray-800 rounded-md shadow-md bg-white/10 backdrop-blur-xl">
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
