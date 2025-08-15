import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';

function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token]);

  const verifyEmail = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      // Send token as a query parameter in the request body instead of URL parameter
      const response = await axios.post(`${apiUrl}/api/users/verify-email`, { token });
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

  const handleResendVerification = async () => {
    // This would typically require the user to enter their email
    // For now, we'll redirect to a resend page
    navigate("/resend-verification");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white sm:bg-gray-50 px-4">
        <div className="w-full max-w-md sm:max-w-xl bg-white rounded-2xl sm:shadow-md px-4 py-8 sm:px-8 sm:py-10">
          <div className="text-center">
            {verificationStatus === "verifying" && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#18162B] mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </>
            )}

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

            {verificationStatus === "error" && (
              <>
                <div className="text-red-500 text-6xl mb-4">✗</div>
                <h2 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <button
                    onClick={handleResendVerification}
                    className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    Resend Verification Email
                  </button>
                  <button
                    onClick={handleGoToLogin}
                    className="w-full py-3 rounded-xl border border-[#18162B] text-[#18162B] font-bold text-base transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    Go to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
