import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore"; // Zustand store for auth
import Sidebar from "../../constants/Sidebar";
import Navbar from "../../components/InternSpace/Navbar";

const Internship = () => {
  // ✅ Zustand Store: Get authentication details
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const userId = user?.userId; // ✅ Get userId properly

  // ✅ State Management
  const [internshipDetails, setInternshipDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Ensure token is set in headers globally (Optional)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // ✅ Fetch Internship Data on Mount
  useEffect(() => {
    if (token && userId) {
      fetchInternshipDetails();
    }
  }, [token, userId]); // ✅ Depend on `token` and `userId`

  const fetchInternshipDetails = async () => {
    if (!token) {
      console.warn("🔴 Missing token. Authorization header will not be sent.");
      setErrorMessage("Authentication error. Please log in again.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      console.log(`🔵 Fetching internship details for user ID: ${userId}`);

      const response = await axios.get(`http://localhost:8080/api/internship/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Ensures cookies are included if needed
      });

      console.log("✅ Fetched internship details:", response.data);
      setInternshipDetails(response.data);
    } catch (err) {
      console.error("❌ Error fetching internship details:", err);

      if (err.response?.status === 403) {
        setErrorMessage("Access denied: You do not have permission to view this data.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized request. Please log in again.");
      } else {
        setErrorMessage("Failed to load internship details. Try again.");
      }
    }

    setLoading(false);
  };

  return (
      <div className="flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <Navbar />

          {/* Internship Details Section */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Internship Details</h1>

            {/* Loading Indicator */}
            {loading && <p className="text-blue-500">Loading internship details...</p>}

            {/* Error Message */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            {/* Internship Details Content */}
            {internshipDetails && (
                <div className="bg-white shadow-md rounded-lg p-8 space-y-6">
                  {/* Company and Role Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-purple-600 mb-2">Company Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Company Name
                        </label>
                        <input
                            type="text"
                            value={internshipDetails.companyName || "Not Available"}
                            readOnly
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Subject
                        </label>
                        <input
                            type="text"
                            value={internshipDetails.role || "Not Available"}
                            readOnly
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Internship Period and Stipend Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-purple-600 mb-2">Internship Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Internship Period
                        </label>
                        <input
                            type="text"
                            value={internshipDetails.period || "Not Available"}
                            readOnly
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Payment Status
                        </label>
                        <input
                            type="text"
                            value={internshipDetails.isPaid ? internshipDetails.stipend : "Unpaid"}
                            readOnly
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-purple-600 mb-2">Additional Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Location
                        </label>
                        <input
                            type="text"
                            value={internshipDetails.location || "Not Available"}
                            readOnly
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Contract Status
                        </label>
                        <input
                            type="text"
                            value={internshipDetails.contractStatus || "Not Available"}
                            readOnly
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Refresh Button */}
            <div className="mt-6">
              <button
                  onClick={fetchInternshipDetails}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh Internship Details
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Internship;
