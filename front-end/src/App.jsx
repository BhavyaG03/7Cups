import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ForumPage from './pages/ForumPage';
import IndexPage from './pages/IndexPage';
import QuestionPage from './pages/QuestionPage';
import UserDashboard from './pages/UserDashboard';
import ListenerDashboard from './pages/ListenerDashboard';

function App() {
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
