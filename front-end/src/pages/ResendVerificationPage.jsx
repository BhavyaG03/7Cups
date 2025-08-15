import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';

function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
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

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="bg-white min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white sm:bg-gray-50 px-4">
        <div className="w-full max-w-md sm:max-w-xl bg-white rounded-2xl sm:shadow-md px-4 py-8 sm:px-8 sm:py-10">
          <h2 className="text-center text-2xl font-bold mb-8">Resend Verification Email</h2>
          
          {status === "success" ? (
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">Please check your email and click the verification link.</p>
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
                Enter your email address and we'll send you a new verification link.
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
                  {status === "loading" ? "Sending..." : "Resend Verification Email"}
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
