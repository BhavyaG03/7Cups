import React from "react";

const SoSPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">SOS Activated</h1>
        <p className="text-left sm:text-center text-gray-700 mb-8 max-w-3xl mx-auto text-base sm:text-lg">
          The listener you were connected with has activated SOS. This means they are in distress and need immediate help. Please understand that they may not be able to continue the conversation.
        </p>
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-1 text-left">What to Do Next</h2>
          <p className="text-gray-700 mb-4 text-left">If you are also in distress, please consider reaching out to emergency services or a crisis hotline. Your safety is important.</p>
          <div className="flex sm:justify-center justify-start">
            <button className="bg-[#e5eef4] text-gray-800 font-semibold rounded-full px-6 py-2 shadow-sm hover:bg-[#d3e3ed] transition text-base">Contact Emergency Services</button>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-2 text-left">Supportive Resources</h2>
          <p className="mb-4 text-gray-700 text-left">Here are some resources that can provide immediate support:</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center bg-[#f1f5f9] rounded-lg px-4 py-3">
              <span className="mr-3 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.08"/><path d="M16 3v4"/><path d="M8 3v4"/><circle cx="12" cy="14" r="4"/></svg>
              </span>
              <div>
                <div className="font-medium text-gray-900">National Crisis Hotline</div>
                <div className="text-gray-500 text-sm">Available 24/7</div>
              </div>
            </div>
            <div className="flex items-center bg-[#f1f5f9] rounded-lg px-4 py-3">
              <span className="mr-3 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
              </span>
              <div>
                <div className="font-medium text-gray-900">Crisis Text Line</div>
                <div className="text-gray-500 text-sm">Text HOME to 741741</div>
              </div>
            </div>
            <div className="flex items-center bg-[#f1f5f9] rounded-lg px-4 py-3">
              <span className="mr-3 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </span>
              <div>
                <div className="font-medium text-gray-900">Mental Health Services Locator</div>
                <div className="text-gray-500 text-sm">Find local resources</div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-left sm:text-center text-gray-700 mt-8 text-base">Remember, you're not alone. Help is available, and reaching out is a sign of strength.</p>
      </div>
    </div>
  );
};

export default SoSPage;
