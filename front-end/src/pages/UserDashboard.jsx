import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserDashboard = () => {
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
