import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract intern details from navigation state
  const [stagiaireId, setStagiaireId] = useState(null);
  const [internName, setInternName] = useState("");

  useEffect(() => {
    if (location.state && location.state.id) {
      setStagiaireId(location.state.id);
      setInternName(location.state.name || "Unknown Intern");
    } else {
      console.error("Error: Stagiaire ID not found in location state.");
    }
  }, [location]);

  // ✅ Fetch supervisorId from localStorage
  const userData = localStorage.getItem("user");
  const supervisorId = userData ? JSON.parse(userData).userId : null;
  const token = localStorage.getItem("token");

  // State for task inputs
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending"); // Default status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!supervisorId) {
    console.error("Supervisor ID not found. Please log in.");
    return (
      <p className="text-red-500 text-center mt-10">
        Error: Supervisor ID not found. Please log in.
      </p>
    );
  }

  // ✅ Submit task request
  const submitTaskToBackend = async () => {
    setLoading(true);
    setError(null);

    if (!stagiaireId || isNaN(stagiaireId)) {
      console.error("Error: Stagiaire ID is missing or invalid.");
      setError("Intern ID is missing. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/superviseur/${supervisorId}/tache?stagiaireId=${stagiaireId}`,
        {
          description: taskDescription,
          startDate: taskDeadline,
          statut: taskStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Task created successfully:", response.data);
      // ✅ Redirect to TaskPage
      navigate(`/tasks/${stagiaireId}`);
    } catch (err) {
      console.error("Failed to create task", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Add a project for {internName}
        </h1>
        {/* Task Form */}
        <form>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Task Description</label>
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description"
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Deadline</label>
              <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>

            {/* ✅ Dropdown for Task Status */}
            <div>
              <label className="block text-gray-600 mb-2">Task Status</label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="pending">pending</option>
                <option value="inprogress">inprogress</option>
                <option value="completed">completed</option>
                <option value="failed">failed</option>
              </select>
            </div>
          </div>

          {/* ✅ Buttons: Create Task & View Tasks */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={submitTaskToBackend}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Creating Task..." : "Create Task"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/tasks/${stagiaireId}`)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View Tasks
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProjectPage;
