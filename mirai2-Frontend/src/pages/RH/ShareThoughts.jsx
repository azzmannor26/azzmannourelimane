import React, { useState } from "react";
import Sidebar from "../../constants/Sidebar.jsx";
import Navbar from "/src/components/InternSpace/Navbar.jsx";

const ShareThoughts = () => {
  const [thought, setThought] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for sharing your thoughts!");
    setThought(""); // Clear the textarea
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <Navbar />

        {/* Share Your Thoughts Section */}
        <div className="p-6 flex flex-col items-center">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Share Your Thoughts</h1>

          {/* Form */}
          <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
            <p className="text-gray-600 mb-4">
              We value your feedback! Share your thoughts, ideas, or suggestions to help us improve.
            </p>
            <form onSubmit={handleSubmit}>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full p-4 border rounded-lg bg-gray-50 resize-none h-40 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareThoughts;
