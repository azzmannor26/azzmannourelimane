import React from "react";
import Sidebar from "../../constants/Sidebar";
import Navbar from "../../components/InternSpace/Navbar";
import Chatbot from "/src/components/Chatbot";

const InternDash = () => {
  return (
      <div className="flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 flex-1">
          {/* Navbar */}
          <Navbar />

          {/* Hero Section */}
          <div className="p-8 bg-gray-50">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Welcome to <span className="text-purple-600">Mirai</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Your one-stop solution to managing every aspect of your internship seamlessly. Stay organized, collaborate efficiently, and achieve your goals with Mirai.
            </p>
          </div>

          {/* Key Features Section */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gray-50">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl border">
              <h2 className="text-xl font-bold text-gray-800">Task Management</h2>
              <p className="text-gray-600 mt-2">
                Stay on top of your tasks with clear deadlines, priorities, and progress tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl border">
              <h2 className="text-xl font-bold text-gray-800">Real-Time Collaboration</h2>
              <p className="text-gray-600 mt-2">
                Work seamlessly with your supervisor to enhance your learning experience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl border">
              <h2 className="text-xl font-bold text-gray-800">Document Management</h2>
              <p className="text-gray-600 mt-2">
                Upload, review, and track your internship documents in a single place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl border md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-bold text-gray-800">Why Choose Mirai?</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                Mirai streamlines the internship process for both interns and supervisors. By providing tools for communication, organization, and tracking, it helps you focus on what matters—learning and growth. Our goal is to empower you to make the most out of your internship experience.
              </p>
            </div>
          </div>
        </div>

        {/* Chatbot */}
        <Chatbot />
      </div>
  );
};

export default InternDash;
