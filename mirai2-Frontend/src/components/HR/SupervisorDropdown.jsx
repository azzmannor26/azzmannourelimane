import React, { useState, useEffect } from "react";
import axios from "axios";

const SupervisorDropdown = ({ selectedSupervisor, setSelectedSupervisor }) => {
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Missing authentication token. Please log in.");
                    setLoading(false);
                    return;
                }

                console.log("🔵 Fetching supervisors...");

                const response = await axios.get("http://localhost:8080/api/rh/superviseurs/ids", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ API Response:", response.data);

                if (!Array.isArray(response.data)) {
                    throw new Error("Invalid API response format. Expected an array.");
                }

                // ✅ Ensure valid data and format properly
                const formattedSupervisors = response.data.map((supervisor) => ({
                    id: supervisor.userId, // ✅ Used internally for selection
                    username: supervisor.username || "Unknown", // ✅ Displayed in UI
                }));

                setSupervisors(formattedSupervisors);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching supervisors:", error);
                setError("Failed to load supervisors. Please try again.");
                setLoading(false);
            }
        };

        fetchSupervisors();
    }, []);

    return (
        <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Assign to Supervisor:</label>
            {loading ? (
                <p className="text-blue-500">Loading supervisors...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : supervisors.length > 0 ? (
                <select
                    value={selectedSupervisor || ""}
                    onChange={(e) => {
                        const selectedId = e.target.value;
                        setSelectedSupervisor(selectedId);
                        console.log("🔄 Selected Supervisor User ID:", selectedId);
                    }}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">Select a Supervisor</option>
                    {supervisors.map((supervisor) => (
                        <option key={`supervisor-${supervisor.id}`} value={supervisor.id}>
                            {supervisor.username} {/* ✅ Only Name is displayed */}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="text-gray-500">No supervisors available.</p>
            )}
        </div>
    );
};

export default SupervisorDropdown;
