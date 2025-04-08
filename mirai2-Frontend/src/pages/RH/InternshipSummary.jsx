import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaUserGraduate, FaChalkboardTeacher, FaFileContract,
    FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaBookOpen, FaArrowLeft
} from "react-icons/fa";

const InternshipSummary = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // ✅ Hook for navigation

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Missing authentication token. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:8080/api/rh/internships", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setInternships(response.data);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching internships:", error);
                setError("Failed to load internships. Please try again.");
                setLoading(false);
            }
        };

        fetchInternships();
    }, []);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
            {/* ✅ Return Button */}
            <button
                onClick={() => navigate("/interns")} // Navigate back
                className="flex items-center text-blue-500 font-semibold mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" /> Return to Interns
            </button>

            <h1 className="text-3xl font-bold text-blue text-center mb-6">📋 Internship Summary</h1>

            {loading ? (
                <p className="text-gray-600">Loading internships...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : internships.length > 0 ? (
                <div className="grid gap-6 max-w-5xl w-full">
                    {internships.map((internship) => (
                        <div key={internship.id} className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800">Internship #{internship.id}</h2>
                            <div className="space-y-4">
                                <SummaryCard icon={FaUserGraduate} title="Intern" value={internship.stagiaireName} />
                                <SummaryCard icon={FaChalkboardTeacher} title="Supervisor" value={internship.superviseurName} />
                                <SummaryCard icon={FaFileContract} title="Contract Status" value={internship.contractStatus} />
                                <SummaryCard icon={FaCalendarAlt} title="Start Date" value={internship.dateDebut} />
                                <SummaryCard icon={FaCalendarAlt} title="End Date" value={internship.dateFin} />
                                <SummaryCard icon={FaBuilding} title="Department" value={internship.departement || "N/A"} />
                                <SummaryCard icon={FaMapMarkerAlt} title="Location" value={internship.location || "N/A"} />
                                <SummaryCard icon={FaMoneyBillWave} title="Payment Status" value={internship.isPaid ? "Paid" : "Unpaid"} />
                                <SummaryCard icon={FaMoneyBillWave} title="Stipend" value={`${internship.stipend} USD`} />
                                <SummaryCard icon={FaBookOpen} title="Internship Topic" value={internship.sujet || "N/A"} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No internships found.</p>
            )}
        </div>
    );
};

// ✅ Reusable Component for Displaying Data
const SummaryCard = ({ icon: Icon, title, value }) => (
    <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-sm">
        <Icon className="text-blue-500 text-2xl" />
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="font-semibold text-gray-800 text-lg">{value}</p>
        </div>
    </div>
);

export default InternshipSummary;
