import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../constants/Sidebar";
import Navbar from "../../components/InternSpace/Navbar";

const Documents = () => {
  // ---------------------------
  // Reports
  // ---------------------------
  const [reports, setReports] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ---------------------------
  // Certificate
  // ---------------------------
  const [certificate, setCertificate] = useState(null);

  // ---------------------------
  // Auth token
  // ---------------------------
  const token = localStorage.getItem("token");

  // ----------------------------------
  // Fetch data on mount
  // ----------------------------------
  useEffect(() => {
    if (token) {
      fetchReports();
      fetchCertificate();
    }
  }, [token]);

  // ----------------------------------
  // Fetch Reports (GET /rapports/mine)
  // ----------------------------------
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/rapports/mine", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // ----------------------------------
  // Fetch Certificate (GET /certifications/mine)
  // ----------------------------------
  const fetchCertificate = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/certifications/mine", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCertificate(res.data);
    } catch (err) {
      // If 404 => no certificate requested yet
      if (err.response && err.response.status === 404) {
        setCertificate(null);
      } else {
        console.error("Error fetching certificate:", err);
      }
    }
  };

  // ----------------------------------
  // Upload a new report
  // ----------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setSelectedFile(null);
      setErrorMessage("Please upload only PDF files.");
    }
  };

  const handleUploadReport = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("rapportName", "My Internship Report");

      await axios.post("http://localhost:8080/api/rapports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Report uploaded successfully!");
      setSelectedFile(null);
      setErrorMessage("");

      // Re-fetch so we see the new report in the list
      fetchReports();
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage("Failed to upload report. Please try again.");
    }
  };

  // ----------------------------------
  // Download a report PDF (GET /rapports/{id}/download)
  // ----------------------------------
  const handleDownloadReport = async (reportId) => {
    if (!token) {
      alert("Not authenticated!");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/rapports/${reportId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const fileBlob = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank"); 
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download the PDF.");
    }
  };

  // ----------------------------------
  // Request a certificate (POST /certifications)
  // ----------------------------------
  const handleRequestCertificate = async () => {
    if (!token) {
      alert("User not authenticated!");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/certifications", null, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert("Certificate request submitted!");
      // After requesting, fetch the certificate => shows 'under_review' or whatever
      fetchCertificate();
    } catch (err) {
      console.error("Certificate request failed:", err);
      alert("Could not request certificate. Check console for details.");
    }
  };

  // ----------------------------------
  // Download certificate PDF (GET /certifications/{id}/download)
  // ----------------------------------
  const handleDownloadCertificate = async () => {
    if (!certificate) return;
    if (!token) {
      alert("Not authenticated!");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/certifications/${certificate.id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const fileBlob = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Error downloading certificate:", err);
      alert("Failed to download certificate. Probably not accepted yet.");
    }
  };

  // ----------------------------------
  // Certificate UI logic
  // ----------------------------------
  const renderCertificateSection = () => {
    if (!certificate) {
      // No certificate record => show "Request" button
      return (
        <div>
          <p className="text-gray-700 mb-4">
            You haven't requested a certificate yet.
          </p>
          <button
            onClick={handleRequestCertificate}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Request Certificate
          </button>
        </div>
      );
    }

    // We have a certificate => show its status
    const status = certificate.status; // under_review, accepted, rejected

    if (status === "under_review") {
      return (
        <p className="text-yellow-600 font-semibold">
          Your certificate request is under review.
        </p>
      );
    } else if (status === "accepted") {
      return (
        <div>
          <p className="text-green-600 font-semibold">
            Your certificate was accepted!
          </p>
          <button
            onClick={handleDownloadCertificate}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Download Certificate PDF
          </button>
        </div>
      );
    } else if (status === "rejected") {
      return (
        <p className="text-red-600 font-semibold">
          Your certificate request was rejected. Please contact your RH or
          try again.
        </p>
      );
    } else {
      return (
        <p>
          Certificate status: <strong>{status}</strong>
        </p>
      );
    }
  };

  // ----------------------------------
  // Render
  // ----------------------------------
  return (
    <div className="flex bg-gray-100 min-h-screen">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="ml-64 flex-1">
    <Navbar />

    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">📄 Documents</h1>
          <p className="text-gray-500 text-lg">Manage your internship reports & certificates.</p>
        </div>
        <button
          onClick={() => {
            fetchReports();
            fetchCertificate();
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Upload Report Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📤 Upload Internship Report</h2>

        {errorMessage && <p className="text-red-500 font-medium">{errorMessage}</p>}

        <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition mb-4">
          {selectedFile ? (
            <p className="text-gray-700 font-medium">{selectedFile.name}</p>
          ) : (
            <label className="cursor-pointer text-purple-700 font-medium hover:underline">
              📂 Select a PDF file to upload
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        <button
          onClick={handleUploadReport}
          className="bg-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          🚀 Upload Report
        </button>
      </div>

      {/* My Reports Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📑 My Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500 italic">No reports uploaded yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((r) => (
              <div key={r.id} className="border p-4 rounded-lg bg-gray-50 hover:shadow-md transition">
                <p className="font-semibold text-gray-800">
                  Status:{" "}
                  <span className={`font-bold ${r.type === "accepted" ? "text-green-600" : "text-yellow-600"}`}>
                    {r.type || "UNKNOWN"}
                  </span>
                </p>
                <button
                  onClick={() => handleDownloadReport(r.id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  🔍 View / Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certification Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎓 Internship Certificate</h2>
        {renderCertificateSection()}
      </div>
    </div>
  </div>
</div>

  );
};

export default Documents;
