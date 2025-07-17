import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/users/register`, {
        username,
        email,
        password,
        role,
        gender,
        age,
      });
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="flex flex-col items-center pt-12 pb-5 justify-center min-h-screen bg-white sm:bg-gray-50 px-4" style={{ fontFamily: 'Epilogue, sans-serif' }}>
      <div className="w-full max-w-md sm:max-w-xl bg-white rounded-2xl sm:shadow-md px-4 py-8 sm:px-8 sm:py-10">
        <h2 className="text-center text-2xl font-bold mb-8">Register</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base text-gray-900"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base placeholder:text-[#8B89A6]"
            />
          </div>
          {/* Role */}
          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base text-gray-900"
            >
              <option disabled>Select your role</option>
              <option value="user">User</option>
              <option value="listener">Listener</option>
            </select>
          </div>
          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#18162B] text-white font-bold text-base mt-5 transition-colors hover:bg-[#23204a] focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            Register
          </button>
        </form>
        {/* Login Redirect */}
        <p className="mt-6 text-center text-sm text-[#8B89A6]">
          Already have an account?
        </p>
        <p className="text-center text-sm mb-2">
          <Link to="/login" className="text-[#8B89A6] underline">Login</Link>
        </p>
        <p className="text-center text-xs text-[#8B89A6] mt-2">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
