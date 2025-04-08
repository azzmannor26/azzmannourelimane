import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../constants/Sidebar.jsx";
import Navbar from "/src/components/InternSpace/Navbar.jsx";
import ApplicationTable from "../../components/HR/ApplicationTable.jsx";

const HRApplication = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    // Fonction pour récupérer les candidatures
    const fetchCandidatures = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Aucun token JWT trouvé. Redirection vers la connexion.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/api/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            setApplications(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    console.error("Non autorisé. Redirection vers la connexion.");
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    console.error(`Erreur ${error.response.status} :`, error.response.data);
                }
            } else {
                console.error("Erreur lors de la récupération des candidatures :", error.message);
            }
        }
    };

    useEffect(() => {
        fetchCandidatures();
    }, [navigate]);

    return (
        <div style={styles.appContainer}>
            <Sidebar />
            <div style={styles.mainContainer}>
                <Navbar />
                <div style={styles.content}>
                    <ApplicationTable applications={applications} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    appContainer: {
        display: "flex",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
    },
    mainContainer: {
        flex: 1,
        marginLeft: "16rem",
        backgroundColor: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
    },
    content: {
        flex: 1,
        padding: "10px 20px",
        overflow: "auto",
    },
};

export default HRApplication;
