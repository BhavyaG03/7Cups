import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';


const Header = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // Clear sessionStorage on logout
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('room_id');
    dispatch(logout());
    navigate('/login')
  };
  const user = useSelector((state) => state.user.user);
  const role=user.role
  const id=user.user.id
  return (
    <div className="flex items-center justify-between w-full h-10 px-6">
        <div className="flex items-center justify-start gap-4">
          <Link to={`/${role}/dashboard`} className="font-sans text-xl font-medium text-black">
            Dashboard
          </Link>
        </div>
        <div onClick={handleLogout} className="font-sans text-lg font-medium text-black cursor-pointer">
            Logout
          </div>
      </div>
  )
}

export default Header