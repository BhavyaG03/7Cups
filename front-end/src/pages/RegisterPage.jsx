import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import Header from '../components/Header';

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${apiUrl}/api/users/register`, {
        username,
        email,
        password,
        role,
        gender,
        age,
      });
      
      if (res.data.requiresVerification) {
        setVerificationSent(true);
        // Don't automatically log in - user needs to verify email first
      } else if (res.data.user) {
        // This case shouldn't happen with the new flow, but keeping for safety
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        sessionStorage.setItem('token', res.data.token);
        dispatch(loginSuccess(res.data.user));
        
        if (res.data.role === "listener") {
          navigate("/listener/dashboard");
        } else if (res.data.role === "user") {
          navigate("/user/dashboard");
        } else {
          navigate("/preview");
        }
      }
      
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white sm:bg-gray-50 px-4">
          <div className="px-4 py-8 w-full max-w-md text-center bg-white rounded-2xl sm:max-w-xl sm:shadow-md sm:px-8 sm:py-10">
            <div className="mb-4 text-6xl text-blue-500">📧</div>
            <h2 className="mb-4 text-2xl font-bold">Check Your Email!</h2>
            <p className="mb-6 text-gray-600">
              We've sent a verification link to <strong>{email}</strong>
            </p>
            <p className="mb-6 text-sm text-gray-500">
              Please check your email and click the verification link to complete your registration.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setVerificationSent(false)}
                className="w-full py-3 rounded-xl border border-[#18162B] text-[#18162B] font-bold text-base transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                Back to Registration
              </button>
              <Link
                to="/resend-verification"
                className="block w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200 text-center"
              >
                Resend Verification Email
              </Link>
              <Link
                to="/login"
                className="block text-[#8B89A6] underline text-sm"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Epilogue, sans-serif' }} className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white sm:bg-gray-50 px-4">
        <div className="px-4 py-8 w-full max-w-md bg-white rounded-2xl sm:max-w-xl sm:shadow-md sm:px-8 sm:py-10">
          <h2 className="mb-8 text-2xl font-bold text-center">Register</h2>
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
              />
            </div>
            {/* Email */}
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
            {/* Password */}
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="px-4 py-3 w-full text-base text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option disabled>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Age */}
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-1">Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="13"
                max="120"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
              />
            </div>
            {/* Role */}
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="px-4 py-3 w-full text-base text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option disabled>Select your role</option>
                <option value="user">User</option>
                <option value="listener">Listener</option>
              </select>
            </div>
            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base mt-5 transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>
          {/* Login Redirect */}
          <p className="mt-6 text-center text-sm text-[#8B89A6]">
            Already have an account?
          </p>
          <p className="mb-2 text-sm text-center">
            <Link to="/login" className="text-[#8B89A6] underline">Login</Link>
          </p>
          <p className="mb-2 text-sm text-center">
            <Link to="/resend-verification" className="text-[#8B89A6] underline">Registered but not verified ?</Link>
          </p>
          <p className="text-center text-xs text-[#8B89A6] mt-2">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
