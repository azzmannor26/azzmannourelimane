import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "/src/constants/Sidebar";
import Navbar from "/src/components/InternSpace/Navbar.jsx";
import OccupationsSidebar from "/src/components/Supervisor/Calendar/OccupationsSidebar";
import CalendarView from "/src/components/Supervisor/Calendar/CalendarView";
import AddAvailabilityModal from "/src/components/Supervisor/Calendar/AddAvailabilityModal";

const MyAvailabilities = () => {
    const [occupations, setOccupations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [supervisorId, setSupervisorId] = useState(null);

    useEffect(() => {
        // Extract supervisorId from localStorage or another source
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.userId) {
            setSupervisorId(storedUser.userId);
        } else {
            setError("User ID not found. Please log in.");
            setLoading(false);
        }

    }, []);

    const fetchAvailabilities = async () => {
        if (!supervisorId) return; // Avoid API call if supervisorId is not available

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:8080/api/superviseur/${supervisorId}/availabilities`,
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            const transformedData = response.data.map(avail => ({
                id: avail.id,
                start: avail.startDate,
                end: avail.endDate,
                title: avail.description
            }));

            setOccupations(transformedData);
        } catch (err) {
            console.error("API Request Failed:", err);
            setError(err.response?.data?.message || "Failed to load availabilities. Check server connection.");
            setOccupations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (supervisorId) {
            fetchAvailabilities();
        }
    }, [supervisorId]);

    const handleAddAvailability = async (newAvailability) => {
        if (!supervisorId) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:8080/api/superviseur/${supervisorId}/availability`,
                {
                    startDate: newAvailability.start,
                    endDate: newAvailability.end,
                    description: newAvailability.title,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setOccupations(prevOccupations => [...prevOccupations, response.data]);
            setShowModal(false);
            fetchAvailabilities();
        } catch (error) {
            console.error("Failed to add availability", error);
            setError("Failed to add availability. Please try again.");
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 bg-gray-50 p-6">
                <Navbar />
                <h1 className="text-4xl font-bold text-gray-800 mb-6">My Availabilities</h1>

                {loading && <p>Loading availabilities...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && supervisorId && (
                    <div className="flex gap-6">
                        <OccupationsSidebar
                            occupations={occupations}
                            onAddAvailabilityClick={() => setShowModal(true)}
                        />
                        <div className="flex-1">
                            <CalendarView occupations={occupations} />
                        </div>
                    </div>
                )}

                {showModal && (
                    <AddAvailabilityModal
                        onClose={() => setShowModal(false)}
                        onAddAvailability={handleAddAvailability}
                    />
                )}
            </div>
        </div>
    );
};

export default MyAvailabilities;
