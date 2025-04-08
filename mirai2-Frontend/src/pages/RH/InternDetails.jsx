import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorDropdown from "../../components/HR/SupervisorDropdown.jsx";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const InternDetails = () => {
    const navigate = useNavigate();
    const [intern, setIntern] = useState(null);
    const [supervisorId, setSupervisorId] = useState("");
    const [internshipDetails, setInternshipDetails] = useState({
        contractStatus: "",
        dateDebut: "",
        dateFin: "",
        departement: "",
        isPaid: false,
        location: "",
        stipend: "",
        sujet: "",
    });
    const [loading, setLoading] = useState(false); // ✅ New state to show loading status
    const [successMessage, setSuccessMessage] = useState(""); // ✅ Store success message

    useEffect(() => {
        const storedIntern = localStorage.getItem("selectedIntern");
        if (storedIntern) {
            setIntern(JSON.parse(storedIntern));
        } else {
            navigate("/interns"); // Redirect if no intern data
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setInternshipDetails({ ...internshipDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!supervisorId) {
            alert("Please select a supervisor.");
            return;
        }

        setLoading(true); // ✅ Show loading state

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Unauthorized");

            const response = await axios.put(
                `http://localhost:8080/api/rh/assign/intern/${intern.id}/supervisor/${supervisorId}`,
                internshipDetails,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setSuccessMessage("✅ Internship assigned successfully!"); // ✅ Set success message
            }
        } catch (error) {
            console.error("Error assigning internship:", error);
            setSuccessMessage("❌ Failed to assign internship.");
        } finally {
            setLoading(false); // ✅ Reset loading state
        }
    };

    return intern ? (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
            {/* ✅ Return Button */}
            <button
                onClick={() => navigate("/interns")} // Navigate back
                className="flex items-center text-blue-500 font-semibold mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" /> Return to Interns
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Intern Details</h1>

            <div className="space-y-4">
                {/* Intern Info */}
                <div>
                    <label className="block text-gray-700 font-semibold">Name</label>
                    <p className="bg-gray-100 p-2 rounded">{intern.username}</p>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">Email</label>
                    <p className="bg-gray-100 p-2 rounded">{intern.email}</p>
                </div>

                {/* Supervisor Selection */}
                <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">Assign to Supervisor:</label>
                    <SupervisorDropdown
                        selectedSupervisor={supervisorId}
                        setSelectedSupervisor={(id) => setSupervisorId(id)}
                    />
                </div>

                {/* Internship Form */}
                <h2 className="text-xl font-semibold text-gray-700 mt-6">Internship Details</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="contractStatus"
                        placeholder="Contract Status"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="dateDebut"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="dateFin"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="stipend"
                        placeholder="Stipend"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="sujet"
                        placeholder="Internship Topic"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleInputChange}
                    />
                </div>

                {/* Confirm Button */}
                <button
                    onClick={handleSubmit}
                    className={`w-full p-3 font-semibold rounded-lg transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    disabled={loading} // ✅ Disable button when loading
                >
                    {loading ? "Assigning..." : "Confirm Assignment"} {/* ✅ Change button text when loading */}
                </button>

                {/* ✅ Show success message */}
                {successMessage && <p className="text-green-600 font-semibold text-center mt-4">{successMessage}</p>}
            </div>

            {/* View Summary Button */}
            <div className="mt-4 text-center">
                <button
                    onClick={() =>
                        navigate("/internship-summary", {
                            state: { ...internshipDetails, stagiaire: intern, superviseur: { username: "Supervisor Name" } },
                        })
                    }
                    className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                >
                    📜 View Internship Summary
                </button>
            </div>
        </div>
    ) : (
        <p>Loading intern details...</p>
    );
};

export default InternDetails;
