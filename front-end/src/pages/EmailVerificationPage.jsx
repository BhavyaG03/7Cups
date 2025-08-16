import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';
import { FiMail } from "react-icons/fi";

function EmailVerificationPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if already verified in this browser session
    const isVerified = localStorage.getItem('emailVerified') === 'true';
    
    if (isVerified) {
      setVerificationStatus("success");
      setMessage("Email already verified successfully.");
    }
  }, []);

  const verifyEmail = async (e) => {
    e.preventDefault();
    
    if (!email || !otp) {
      setVerificationStatus("error");
      setMessage("Email and verification code are required");
      return;
    }
    
    // Verify with OTP
    await verifyEmailWithOTP(email, otp);
  };

  const handleResendVerification = async () => {
    if (!email) {
      setVerificationStatus("error");
      setMessage("Please enter your email address to resend the verification code");
      return;
    }
    
    setVerificationStatus("sending");
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/api/users/resend-verification`, { email });
      setVerificationStatus("idle");
      setMessage(response.data.message || "Verification code sent successfully. Please check your email.");
    } catch (error) {
      setVerificationStatus("error");
      setMessage(error.response?.data?.message || "Failed to resend verification code");
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const verifyEmailWithOTP = async (email, otpToVerify) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setVerificationStatus("verifying");
    try {
      const response = await axios.post(`${apiUrl}/api/users/verify-email`, { 
        email: email,
        otp: otpToVerify 
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
            <h1 className="text-2xl font-bold">Email Verification</h1>
            <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
          </div>
            {/* Verification Form */}
            {(verificationStatus === "idle" || verificationStatus === "error") && (
              <form onSubmit={verifyEmail} className="space-y-4">
                {message && (
                  <div className={`p-3 rounded-lg ${verificationStatus === "error" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"} mb-4`}>
                    {message}
                  </div>
                )}
                
                <div className="text-left">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    required
                  />
                </div>
                
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
                  onClick={handleResendVerification}
                  className="w-full py-3 rounded-xl bg-white border border-[#18162B] text-[#18162B] font-bold text-base transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Resend Verification Code
                </button>
                
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-base transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Back to Login
                </button>
              </form>
            )}
            
            {/* Verifying State */}
            {verificationStatus === "verifying" && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#18162B] mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </>
            )}
            
            {/* Sending State */}
            {verificationStatus === "sending" && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#18162B] mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold mb-4">Sending Verification Code</h2>
                <p className="text-gray-600">Please wait while we send a new verification code...</p>
              </>
            )}

            {/* Success State */}
            {verificationStatus === "success" && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
  );
}

export default EmailVerificationPage;
