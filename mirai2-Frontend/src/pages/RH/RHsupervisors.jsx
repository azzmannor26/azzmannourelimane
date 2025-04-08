import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../constants/Sidebar.jsx";
import Navbar from "/src/components/InternSpace/Navbar.jsx";
import SupervisorCard from "../../components/HR/SupervisorCard.jsx";

const RHsupervisors = () => {
    const navigate = useNavigate();
    const [supervisors, setSupervisors] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Fetch all supervisors from the backend
    useEffect(() => {
        const fetchSupervisors = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("🔴 No token found, redirecting to login.");
                alert("Session expired. Please log in again.");
                navigate("/login");
                return; // 🔥 Fix: Prevent further execution
            }

            try {
                console.log("🔵 Fetching supervisors...");

                const response = await axios.get("http://localhost:8080/api/rh/superviseurs/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                setSupervisors(response.data);
                console.log("✅ Supervisors fetched successfully.");
            } catch (err) {
                console.error("❌ Error fetching supervisors:", err);

                if (err.response?.status === 401) {
                    alert("Session expired. Please log in again.");
                    localStorage.removeItem("token"); // Only remove token if 401
                    navigate("/login");
                } else {
                    setError(`Server Error: ${err.response?.statusText || "Unknown error"}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSupervisors();
    }, [navigate]);

    // ✅ Fix department display issue
    const filteredSupervisors = selectedDepartment
        ? supervisors.filter((sup) => sup.department === selectedDepartment)
        : supervisors;

    // ✅ Handle navigation without redirecting to login
    const handleSupervisorClick = (supervisor) => {
        navigate(`/supervisor/${supervisor.id}`, { state: supervisor });
    };

    return (
        <div className="flex-1 ml-64 bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-100">
                <Navbar />
                <main className="flex-1 p-8 overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Supervisors</h1>
                        <div>
                            <label className="mr-2 font-medium text-gray-700">Filter by Department:</label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="border border-gray-300 rounded px-4 py-2"
                            >
                                <option value="">All Departments</option>
                                {[...new Set(supervisors.map((s) => s.department))].map((dept, index) => (
                                    <option key={index} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Loading and Error Handling */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredSupervisors.map((supervisor) => (
                                <div key={supervisor.username} onClick={() => handleSupervisorClick(supervisor)}>
                                    <SupervisorCard
                                        name={supervisor.username}
                                        department={supervisor.department} // ✅ FIXED
                                        email={supervisor.email}
                                        position={supervisor.poste}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RHsupervisors;
