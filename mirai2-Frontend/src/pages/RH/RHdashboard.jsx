import React from "react";
import Sidebar from "/src/constants/Sidebar"; // Sidebar Component
import Navbar from "/src/components/InternSpace/Navbar.jsx";


const RHdashboard = () => {
    return (
        <div className="flex h-screen relative">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 bg-gray-50">
                {/* Header */}
                <Navbar />

                {/* Dashboard Content */}
                <main className="p-8">
                    <section className="bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Welcome to Your Dashboard 🎉
                        </h1>
                        <p className="text-gray-600 text-lg mb-6">
                            We're excited to help you manage your interns efficiently. Here's a quick guide to get you started:
                        </p>

                        {/* Guide Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-blue-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                    1. View Your Interns
                                </h3>
                                <p className="text-blue-600">
                                    Go to the <span className="font-semibold">"My Interns"</span> tab to view and manage your list of interns.
                                </p>
                            </div>

                            <div className="p-4 bg-green-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-green-700 mb-2">
                                    2. Reports & Analytics
                                </h3>
                                <p className="text-green-600">
                                    Check out the <span className="font-semibold">"Reports"</span> section for detailed performance analytics.
                                </p>
                            </div>

                            <div className="p-4 bg-purple-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                                    3. Manage Availabilities
                                </h3>
                                <p className="text-purple-600">
                                    Update your availability using the "My Availabilities" section.
                                </p>
                            </div>
                        </div>

                        {/* Encouragement */}
                        <div className="mt-8">
                            <p className="text-lg font-semibold text-gray-700">
                                Need Help? Check the{" "}
                                <span className="text-blue-500 underline cursor-pointer">
                                    "Chat"
                                </span>{" "}
                                section to contact support anytime!
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            {/* Chatbot Component */}
        
        </div>
    );
};

export default RHdashboard;
