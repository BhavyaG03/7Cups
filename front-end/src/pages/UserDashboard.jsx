import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  console.log(user);
  console.log("user id", user.user.id);
  const id = user.user.id;
  const apiUrl = import.meta.env.VITE_API_URL;

  const articleImages = ["/blog.png", "/blog1.jpg", "/blog2.png"];

  return (
    <div className="flex flex-col items-start w-full min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-start justify-between w-full min-h-screen px-10 py-6 bg-gray-100">
        {/* Left Content (Centered) */}
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="font-sans text-4xl font-bold text-slate-700">
            Hi {user?.user?.username}
          </h1>
          <Link to="/preview">
            <button className="px-6 py-3 mt-3 text-lg font-semibold text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
              Start Chat
            </button>
          </Link>

          {/* New Calmify Introduction Section */}
          <div className="w-full max-w-3xl p-6 mt-8 text-sm text-gray-800 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-bold text-center text-gray-900">
              Welcome to Calmify!
            </h2>
            <p className="mt-2 text-center">
              We are an emotional support platform that connects you with a
              trained peer who will listen and offer support. When you press{" "}
              <span className="font-semibold">"Join Chat,"</span> you'll answer a
              few quick questions to help us understand how you're feeling before
              being connected.
            </p>
            <p className="mt-2 text-center">
              <span className="font-semibold">Your privacy is our priority</span>
              —your name won’t be visible, chats aren’t recorded, and we urge you
              not to share personal details.This is a safe space to express yourself freely. While we strive to
              provide a smooth experience, this website is a prototype and may
              have occasional issues.
            </p>
            <p className="mt-2 font-semibold text-center">
              If you face any problems, please reach out: +91 82383 78390.
            </p>

            {/* Important Features */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-900">
                Important Features:
              </h3>
              <ul className="mt-2 ml-4 list-disc">
                <li>
                  <span className="font-semibold">Report Button:</span> If you
                  feel uncomfortable or encounter misuse, you can report the
                  chat.
                </li>
                <li>
                  <span className="font-semibold">Feedback Form:</span> After the
                  conversation, you’ll be asked to rate your experience and
                  provide feedback on the conversation and the listener. Please
                  ensure you fill the feedback form.
                </li>
              </ul>
            </div>
            <p className="mt-4 font-semibold text-center">
              Thank you for your patience, and we’re glad you’re here!
            </p>
          </div>
           {/* Existing Disclaimer Section */}
           <div className="w-full max-w-2xl p-3 mt-4 text-xs text-gray-800 rounded-md shadow-md bg-white/10 backdrop-blur-xl">
            <h3 className="mb-1 text-sm font-semibold text-center text-gray-800">
              General Disclaimer
            </h3>
            <p className="leading-tight text-center">
              Calmify is an emotional well-being platform offering a safe space
              for open conversations. Our volunteers are trained peers, not
              mental health professionals, and cannot diagnose, treat, or
              provide medical advice.
              <br />
              <br />
              This is not a substitute for therapy or emergency services. If
              you're in crisis or need urgent help, please contact a licensed
              professional or a crisis hotline.
              <br />
              <br />
              For your safety, do not share personal identification details on
              this platform.
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
    </div>
  );
};

export default UserDashboard;
