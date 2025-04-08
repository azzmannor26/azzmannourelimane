import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore"; // Zustand store for auth
import Sidebar from "../../constants/Sidebar";
import Navbar from "../../components/InternSpace/Navbar";

const Supervisor = () => {
  // ✅ Zustand Store: Get authentication details
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const userId = user?.userId; // ✅ Get userId properly

  // ✅ State Management
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch Supervisor Data on Mount
  useEffect(() => {
    if (token && userId) {
      fetchSupervisor();
    }
  }, [token, userId]);

  const fetchSupervisor = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      console.log(`Fetching supervisor for user ID: ${userId}`);
      const response = await axios.get(`http://localhost:8080/api/supervisor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log("Fetched supervisor data:", response.data);
      setSupervisor(response.data);
    } catch (err) {
      console.error("Error fetching supervisor:", err);

      if (err.response?.status === 403) {
        setErrorMessage("Access denied: Only interns can view supervisor info.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized request. Please log in again.");
      } else {
        setErrorMessage("Failed to load supervisor data. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <Navbar />

        {/* Supervisor Section */}
        <div className="p-6 flex flex-col items-center">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Supervisor Info</h1>

          {/* Loading Indicator */}
          {loading && <p className="text-blue-500">Loading supervisor info...</p>}

          {/* Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Supervisor Details */}
          {supervisor && (
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row">
              {/* ✅ Profile Image (Restored) */}
              <div className="flex justify-center items-center mb-6 md:mb-0 md:w-1/3">
                <div className="w-36 h-36 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={supervisor.profileImage || "https://i.pravatar.cc/400?img=12"} // ✅ Keep original image
                    alt="Supervisor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Supervisor Info */}
              <div className="flex-1 md:ml-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Name</label>
                    <input
                      type="text"
                      value={supervisor.username || "Unknown"}
                      readOnly
                      className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  {/* Role/Poste */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Poste</label>
                    <input
                      type="text"
                      value={supervisor.poste || "Not Available"}
                      readOnly
                      className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      value={supervisor.email || "No Email Provided"}
                      readOnly
                      className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Department</label>
                    <input
                      type="text"
                      value={supervisor.departement || "Not Available"}
                      readOnly
                      className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-6">
            <button
              onClick={fetchSupervisor}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Supervisor Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supervisor;
