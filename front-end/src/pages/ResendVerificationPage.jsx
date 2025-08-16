import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';
import { FiMail } from "react-icons/fi";

function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/api/users/resend-verification`, { email });
      setStatus("success");
      setMessage(response.data.message);
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Failed to resend verification email");
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const verifyEmailWithOTP = async (e) => {
    e.preventDefault();
    
    if (!email || !otp) {
      setVerificationStatus("error");
      setMessage("Email and verification code are required");
      return;
    }
    
    setVerificationStatus("verifying");
    
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/api/users/verify-email`, { 
        email: email,
        otp: otp 
      });
      
      setVerificationStatus("success");
      setMessage(response.data.message);
      
      // Store verification status in localStorage to maintain across browsers/devices
      localStorage.setItem('emailVerified', 'true');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setVerificationStatus("error");
      setMessage(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white sm:bg-gray-50 px-4">
        <div className="w-full max-w-md sm:max-w-xl bg-white rounded-2xl sm:shadow-md px-4 py-8 sm:px-8 sm:py-10">
          <div className="text-center mb-6">
            <FiMail className="text-5xl text-[#18162B] mx-auto mb-4" />
            <h2 className="text-center text-2xl font-bold">Resend Verification Code</h2>
          </div>
          
          {status === "success" && verificationStatus === "idle" ? (
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">Please enter the 6-digit verification code sent to your email.</p>
              
              <form onSubmit={verifyEmailWithOTP} className="space-y-4">
                {verificationStatus === "error" && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 mb-4">
                    {message}
                  </div>
                )}
                
                <div className="text-left">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    maxLength="6"
                    minLength="6"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Verify Email
                </button>
                
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-base transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Back to Login
                </button>
              </form>
            </div>
          ) : verificationStatus === "verifying" ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#18162B] mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          ) : verificationStatus === "success" ? (
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">Email Verified Successfully!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">Redirecting to login page...</p>
              <button
                onClick={handleGoToLogin}
                className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-6">
                Enter your email address and we'll send you a new 6-digit verification code.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[16px] font-medium text-gray-900 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
                  />
                </div>

                {status === "error" && (
                  <div className="text-red-600 text-sm text-center">{message}</div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Resend Verification Code"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleGoToLogin}
                  className="text-[#8B89A6] underline text-sm"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResendVerificationPage;
