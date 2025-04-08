import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskPage = () => {
    const { stagiaireId } = useParams(); // ✅ Get intern ID from URL
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch supervisor ID from localStorage
    const userData = localStorage.getItem("user");
    const supervisorId = userData ? JSON.parse(userData).userId : null;
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!supervisorId || !stagiaireId) {
            setError("Supervisor or Intern ID is missing.");
            setLoading(false);
            return;
        }

        // ✅ Fetch tasks for this intern
        const fetchTasks = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/superviseur/${supervisorId}/stagiaire/${stagiaireId}/taches`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json",
                        },
                    }
                );

                setTasks(response.data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError("Failed to load tasks. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [supervisorId, stagiaireId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Assigned Tasks
                </h1>

                {loading && <p>Loading tasks...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && tasks.length === 0 && (
                    <p className="text-gray-600">No tasks assigned yet.</p>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Deadline</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Intern</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task, index) => (
                            <tr key={index} className="border">
                                <td className="border p-2">{task.description}</td>
                                <td className="border p-2">{task.dateEcheance}</td>
                                <td className="border p-2">{task.statut}</td>
                                <td className="border p-2">{task.stagiaireName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <button
                    onClick={() => navigate("/myinterns")}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to Interns
                </button>
            </div>
        </div>
    );
};

export default TaskPage;