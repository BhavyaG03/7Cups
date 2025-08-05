import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = async () => {
    // Clear sessionStorage on logout
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('room_id');
    dispatch(logout());
    navigate('/')
  };

  return (
    <header className="w-full flex justify-between items-center px-4 sm:px-10 py-5 bg-white shadow-sm">
      <div className="text-xl font-bold tracking-tight">Mindfree</div>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <div onClick={handleLogout} className="px-4 py-2 rounded-lg font-medium text-[#18162B] border border-[#18162B] hover:bg-[#f5f5f5] transition cursor-pointer">
            Logout
          </div>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded-lg font-medium text-[#18162B] border border-[#18162B] hover:bg-[#f5f5f5] transition">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-lg font-medium text-white bg-[#18162B] hover:bg-[#23204a] transition">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header