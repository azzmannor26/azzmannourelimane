import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore"; // Import Zustand store
import Sidebar from "../../constants/Sidebar";
import Navbar from "../../components/InternSpace/Navbar";

const Projects = () => {
  // ✅ Zustand Store: Get authentication details
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user); // Get full user object
  const userId = user?.userId; // ✅ Get userId properly

  // ✅ State Management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch Tasks on Mount
  useEffect(() => {
    if (token && userId) {
      fetchTasks();
    }
  }, [token, userId]);

  const fetchTasks = async () => {
    if (!userId) {
      setErrorMessage("User ID is missing. Please log in again.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear any previous error
    try {
      console.log(`Fetching tasks for user ID: ${userId}`);
      const response = await axios.get(`http://localhost:8080/api/taches/stagiaire/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("Fetched tasks:", response.data);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);

      if (err.response?.status === 401) {
        setErrorMessage("Unauthorized access. Please log in again.");
      } else {
        setErrorMessage("Failed to load tasks. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      console.log(`Updating status for task ID ${taskId} to ${newStatus}`);

      // ✅ Convert to lowercase to match backend ENUM values
      const formattedStatus = newStatus.toLowerCase();

      const response = await axios.put(
        `http://localhost:8080/api/taches/${taskId}/status`,
        new URLSearchParams({ newStatus: formattedStatus }), // ✅ Fix: Send as URL-encoded data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded", // ✅ Ensure correct format
          },
          withCredentials: true,
        }
      );

      console.log("Task updated successfully:", response.data);

      // ✅ Update local state immediately
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, statut: formattedStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);

      if (err.response?.status === 400) {
        alert("Invalid status update request. Check the request format.");
      } else if (err.response?.status === 401) {
        alert("Unauthorized request. Please log in again.");
      } else {
        alert("Failed to update task status. Try again.");
      }
    }
  };

  // ✅ Get Status Class for Styling
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "inprogress":
        return "bg-yellow-100 text-yellow-600";
      case "pending":
        return "bg-red-100 text-red-600";
      case "failed":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Render Component
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <Navbar />

        {/* Content */}
        <div className="p-6">
          {/* Page Header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Projects</h1>
          <p className="text-gray-600 mb-8">Manage your tasks assigned by the supervisor.</p>

          {/* Loading Indicator */}
          {loading && <p className="text-blue-500">Loading tasks...</p>}

          {/* Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Task List */}
          {tasks.length === 0 && !loading ? (
            <p className="text-gray-500">No tasks assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{task.description}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Deadline:</strong> {task.dateEcheance || "No Deadline"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Assigned By:</strong> {task.superviseur?.username || "Unknown"}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {/* Status Tag */}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(task.statut)}`}>
                      {task.statut}
                    </span>

                    {/* Status Dropdown */}
                    <select
                      value={task.statut}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="border border-gray-300 text-sm rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="completed">Completed</option>
                      <option value="inprogress">In Progress</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-6">
            <button
              onClick={fetchTasks}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
