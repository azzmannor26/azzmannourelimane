import React from "react";
import { useLocation, useParams } from "react-router-dom";

const DocumentViewer = () => {
    const { id } = useParams(); // Get the report ID from URL
    const location = useLocation();
    const { report } = location.state || {}; // Retrieve the report data

    if (!report) {
        return <div className="p-8 text-red-500">No document found!</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Viewing Document for {report.internName}
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">
                    <strong>Project Name:</strong> {report.projectName}
                </p>
                <p className="mb-4">
                    <strong>Submission Date:</strong> {report.submissionDate}
                </p>
                <p className="mb-4">
                    <strong>Status:</strong> {report.status}
                </p>
                <div className="mt-4">
                    {/* Mock Document Preview */}
                    <iframe
                        src="https://example.com/document.pdf" // Replace with actual document URL
                        title="Document Preview"
                        className="w-full h-96 border rounded-lg"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
