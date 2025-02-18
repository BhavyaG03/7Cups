import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate=useNavigate()
  const user = useSelector((state) => state.user.user);
  console.log(user)
  console.log("user id",user.user.id)
  const id=user.user.id;
  const apiUrl=import.meta.env.VITE_API_URL;
  
  const articleImages = [
    "/blog.png",
    "/blog1.jpg",
    "/blog2.png",
  ];
  const handleLogout = async () => {
    if (id) {
      try {
        await fetch(`${apiUrl}/api/users/logout`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        console.log("logged out")
        navigate('/')
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-between min-h-screen p-10 bg-gray-100">
      {/* Left Content (Centered) */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-5xl font-bold text-gray-800">
          Hi {user?.user?.username}
        </h1>
        <Link to='/preview'>
          <button className="px-6 py-3 mt-12 text-lg font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
            Start Chat
          </button>
        </Link>
        <button onClick={handleLogout} className="px-6 py-3 mt-12 text-lg font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
            Logout
          </button>
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

      {/* Right Sidebar */}
      <div className="w-1/4 h-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="pb-2 text-xl font-bold text-gray-800 border-b">
          Blogs and Articles
        </h2>
        <div className="flex flex-col gap-4 mt-4">
          {articleImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Article ${index + 1}`}
              className="w-full transition-all rounded-md shadow-sm hover:shadow-md"
              width={270}
              height={180}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
