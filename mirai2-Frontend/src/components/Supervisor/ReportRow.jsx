import React, { useState } from "react";
import axios from "axios";

const ReportRow = ({ report, onStatusChange }) => {
    const { id, nom, type, stagiaire } = report;
    const [loading, setLoading] = useState(false);

    // Download the file from /rapports/{id}/download
    const handleViewDocument = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/rapports/${id}/download`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });
            const fileBlob = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(fileBlob);
            window.open(fileURL, "_blank");
        } catch (err) {
            console.error("Error downloading file:", err);
            alert("Failed to download the file.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusClick = (newStatus) => {
        onStatusChange(id, newStatus);
    };

    const baseBtnClasses =
        "w-10 h-10 flex items-center justify-center border-2 rounded transition-colors duration-200";

    return (
        <tr className="border-b hover:bg-gray-50">
            {/* Intern's Name */}
            <td className="p-4">
                {stagiaire && stagiaire.username ? stagiaire.username : "Unknown Intern"}
            </td>

            {/* Report Name */}
            <td className="p-4">{nom}</td>

            {/* Current Status */}
            <td className="p-4 capitalize">{type}</td>

            {/* Manage Column (Accept/Reject) */}
            <td className="p-4">
                <div className="flex items-center space-x-2">
                    {/* Accept Button */}
                    <button
                        onClick={() => handleStatusClick("accepted")}
                        disabled={type === "accepted" || loading}
                        className={
                            baseBtnClasses +
                            (type === "accepted"
                                ? " bg-green-500 border-green-600 text-white cursor-default"
                                : " bg-white border-green-500 text-green-500 hover:bg-green-50")
                        }
                        title="Accept"
                    >
                        <span className="text-xl font-bold">✓</span>
                    </button>

                    {/* Reject Button */}
                    <button
                        onClick={() => handleStatusClick("rejected")}
                        disabled={type === "rejected" || loading}
                        className={
                            baseBtnClasses +
                            (type === "rejected"
                                ? " bg-red-500 border-red-600 text-white cursor-default"
                                : " bg-white border-red-500 text-red-500 hover:bg-red-50")
                        }
                        title="Reject"
                    >
                        <span className="text-xl font-bold">✕</span>
                    </button>
                </div>
            </td>

            {/* Reports Column (View button) */}
            <td className="p-4">
                <button
                    onClick={handleViewDocument}
                    disabled={loading}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600
                     transition-colors duration-200 disabled:opacity-70"
                >
                    {loading ? "Loading..." : "View"}
                </button>
            </td>
        </tr>
    );
};

export default ReportRow;
