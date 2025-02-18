import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate=useNavigate()
  const handleLogout = async () => {
    if (id) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        console.log("logged out")
        navigate('/login')
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };
  const user = useSelector((state) => state.user.user);
  const role=user.role
  const id=user.user.id
  return (
    <div className="flex items-center justify-between w-full h-10 px-6">
        <div className="flex items-center justify-start gap-4">
          <Link className="font-sans text-xl font-medium text-black">
            Calmify
          </Link>
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