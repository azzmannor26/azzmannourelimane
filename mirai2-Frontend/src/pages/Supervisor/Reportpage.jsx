import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "/src/constants/Sidebar";
import Navbar from "/src/components/InternSpace/Navbar.jsx";
import ReportTable from "/src/components/Supervisor/ReportTable";

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all rapports for the supervisor
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/api/rapports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReports(response.data);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to fetch reports. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    // Handle status change (accepted/rejected)
    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8080/api/rapports/${id}/status`,
                null,
                {
                    params: { newStatus },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Update local state
            setReports((prev) =>
                prev.map((rep) => (rep.id === id ? { ...rep, type: newStatus } : rep))
            );
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">
                        Reports Dashboard
                    </h1>

                    {loading && <p className="text-gray-600">Loading reports...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && !error && (
                        <ReportTable
                            reports={reports}
                            onStatusChange={handleStatusChange}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ReportsPage;
