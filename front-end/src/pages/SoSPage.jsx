import React from "react";

const SoSPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        {/* SOS Header */}
        <h1 className="text-3xl font-bold text-center text-red-400">
          🚨 SOS Activated
        </h1>
        <p className="mt-2 text-center text-gray-700">
          The listener has pressed the <span className="font-semibold">SOS button</span>, which means they feel unable to continue this conversation. 
          This does not necessarily mean something is wrong, but they may feel the conversation is beyond their capacity to handle.
        </p>

        {/* Explanation Section */}
        <div className="mt-4">
          <p className="text-gray-800">
            At <span className="font-semibold">MindFree</span>, our listeners are trained peers, not professionals. 
            If you feel you need further support, we encourage you to reach out to a mental health professional or a trusted support system.
          </p>
        </div>

        {/* Suggestions Section */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">You can consider:</h2>
          <ul className="mt-2 ml-5 text-gray-800 list-disc">
            <li>
              <span className="font-semibold">Reflecting</span> on your thoughts and feelings—sometimes, another conversation might help.
            </li>
            <li>
              <span className="font-semibold">Reaching out</span> to a friend, family member, or support group for guidance.
            </li>
            <li>
              <span className="font-semibold">Seeking professional help</span> if you feel it might benefit you.
            </li>
          </ul>
        </div>

        {/* Closing Message */}
        <p className="mt-6 font-semibold text-center text-gray-700">
          We appreciate your understanding, and we’re here to support you in the best way we can. 💙
        </p>
      </div>
    </div>
  );
};

export default SoSPage;
