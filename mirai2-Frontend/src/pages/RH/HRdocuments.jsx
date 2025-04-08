import React, { useState, useEffect } from "react";
import Sidebar from "../../constants/Sidebar.jsx";
import Navbar from "/src/components/InternSpace/Navbar.jsx";

const DocumentPage = () => {
    const [demands, setDemands] = useState([]);

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = () => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/api/certifications", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => setDemands(data))
            .catch(error => console.error("Error fetching certifications:", error));
    };

    const handleValidate = (certificationId) => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/certifications/${certificationId}/status?newStatus=accepted`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert(`✅ Certification ${certificationId} validée avec succès !`);
                fetchCertifications();  // Actualiser la liste des certifications
            })
            .catch(error => console.error("Erreur lors de la validation :", error));
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 bg-gray-50">
                <Navbar />
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">All Certifications</h2>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Username</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Document</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {demands.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.id}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-blue-500">{item.username}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.typedocument}</td>
                                    <td className="py-3 px-4 text-sm">
                                        {item.status === 'accepted' ? (
                                            <span className="text-green-600">Accepted</span>
                                        ) : (
                                            <span className="text-red-600">Rejected</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {item.status !== 'accepted' && (
                                            <button
                                                onClick={() => handleValidate(item.id)}
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Valider
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPage;
