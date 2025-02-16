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
    <div className="flex flex-col items-center justify-center h-full px-4 py-10 bg-gradient-to-tr from-gray-500 to-gray-700">
      <div className="flex flex-col w-full max-w-5xl px-3 overflow-hidden bg-white rounded-lg shadow-lg md:flex-row">
        {/* Left Side Image */}
        <div className="hidden bg-blue-600 md:block md:w-1/2">
          <img
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg?semt=ais_hybrid"
            alt="Register"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full p-8 md:w-1/2">
          <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">Sign Up</h2>
          <p className="mb-6 text-center text-gray-500">Create an account to get started.</p>

          <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
  {/* Username (Shorter) */}
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-600">Username</label>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
    />
  </div>

  {/* Email (Longer) */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-gray-600">Email</label>
    <input
      type="email"
      placeholder="Enter email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="listener">Listener</option>
              </select>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>

          {/* Login Redirect */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full max-w-2xl p-3 mt-4 text-xs text-gray-800 rounded-md shadow-md bg-white/10 backdrop-blur-xl">
  <h3 className="mb-1 text-sm font-semibold text-center text-gray-800">General Disclaimer</h3>
  <p className="leading-tight text-center">
    Calmify is an emotional well-being platform offering a safe space for open conversations. 
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

export default RegisterPage;
