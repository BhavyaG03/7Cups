import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ForumPage from './pages/ForumPage';
import IndexPage from './pages/IndexPage';
import QuestionPage from './pages/QuestionPage';
import UserDashboard from './pages/UserDashboard';
import ListenerDashboard from './pages/ListenerDashboard';
import { useSelector } from "react-redux";
import axios from "axios";
import ReportPage from './pages/ReportPage';
import ReviewPage from './pages/ReviewPage';



function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.user?.user);
  const id=user?.user?.id;
  useEffect(() => {
    const handleLogout = async () => {
      if (id) {
        try {
          await fetch(`${apiUrl}/api/users/logout`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
            keepalive: true, 
          });
        } catch (error) {
          console.error("Error logging out:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleLogout);
    window.addEventListener("unload", handleLogout);

    return () => {
      window.removeEventListener("beforeunload", handleLogout);
      window.removeEventListener("unload", handleLogout);
    };
  }, [id, apiUrl]);
  
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/listener/dashboard" element={<ListenerDashboard />} />
        <Route path="/preview" element={<QuestionPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
