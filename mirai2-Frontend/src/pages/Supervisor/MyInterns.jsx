import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "/src/constants/Sidebar";
import Navbar from "/src/components/InternSpace/Navbar.jsx";
import InternCard from "/src/components/Supervisor/InternCard";

const MyInterns = () => {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const token = localStorage.getItem("token");
                const userData = localStorage.getItem("user");

                if (!userData) {
                    throw new Error("User data not found in localStorage. Please log in.");
                }

                // Parse userData from JSON
                const user = JSON.parse(userData);
                const supervisorId = user.userId; // Extract `userId` as `supervisorId`

                if (!supervisorId) {
                    throw new Error("Supervisor ID not found. Please log in.");
                }

                const response = await axios.get(`http://localhost:8080/api/superviseur/${supervisorId}/stagiaires`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    },
                    withCredentials: true
                });

                setInterns(response.data);
            } catch (err) {
                console.error("Error fetching interns:", err);
                setError(err.message || "Failed to load interns.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterns();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 bg-gray-50">
                {/* Header */}
                <Navbar />

                {/* Main Content */}
                <main className="p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">My Interns</h1>

                    {loading && <p>Loading interns...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Intern Cards Grid */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {interns.map((intern) => (
                                <InternCard
                                    key={intern.id}
                                    id={intern.id}
                                    name={intern.name}
                                    email={intern.email}
                                    image={intern.image || "/default-profile.png"} // Fallback image
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyInterns;
