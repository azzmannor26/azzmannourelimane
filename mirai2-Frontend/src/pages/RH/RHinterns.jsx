import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../constants/Sidebar.jsx";
import Navbar from "../../components/InternSpace/Navbar.jsx";
import InternCard from "/src/components/HR/InternCard.jsx";

const RHinterns = () => {
    const [internsData, setInternsData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Unauthorized");

                const response = await axios.get("http://localhost:8080/api/rh/stagiaires/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setInternsData(response.data);
            } catch (error) {
                console.error("Error fetching interns:", error);
            }
        };

        fetchInterns();
    }, []);

    // ✅ Store selected intern ID in localStorage before navigating
    const handleInternClick = (intern) => {
        localStorage.setItem("selectedIntern", JSON.stringify(intern));
        navigate(`/intern/${intern.id}`);
    };

    return (
        <div className="flex-1 ml-64 bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-100">
                <Navbar />
                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold">My Interns</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {internsData.map((intern) => (
                            <div key={intern.id} onClick={() => handleInternClick(intern)}>
                                <InternCard
                                    id={intern.id}
                                    name={intern.username}
                                    email={intern.email}
                                    image={intern.image || "/default-avatar.png"}
                                />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RHinterns;
