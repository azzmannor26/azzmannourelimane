import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicationTable = ({ applications = [] }) => {
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [data, setData] = useState(applications);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null); // Track which application is being processed

    useEffect(() => {
        if (applications.length === 0) {
            fetchApplications();
        }
    }, [applications]);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token d'autorisation manquant. Veuillez vous reconnecter.");
            }

            const response = await axios.get("http://localhost:8080/api/api/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("📌 Données récupérées :", response.data);
            setData(response.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des candidatures :", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptApplication = async (id) => {
        const token = localStorage.getItem("token");

        if (!id) {
            console.error("❌ ID de candidature non défini !");
            alert("Erreur : ID de candidature non défini.");
            return;
        }

        console.log("🔍 Tentative de validation pour la candidature ID :", id);

        if (!token) {
            alert("Token d'autorisation manquant. Veuillez vous reconnecter.");
            return;
        }

        setProcessingId(id); // Mark this application as being processed

        try {
            const response = await axios.put(
                `http://localhost:8080/api/rh/candidatures/valider/${id}`,
                {}, // Empty body
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("📥 Réponse du backend :", response);

            if (response.status === 200) {
                alert("✅ Candidature validée avec succès !");
                fetchApplications(); // Reload applications
            } else {
                console.error(`❌ Erreur : ${response.statusText}`);
                alert(`Erreur : ${response.statusText}`);
            }
        } catch (error) {
            console.error("❌ Erreur lors de la validation :", error);
            alert("❌ Une erreur est survenue lors de la validation de la candidature.");
        } finally {
            setProcessingId(null); // Reset processing state
        }
    };

    const filteredApplications = selectedDepartment
        ? data.filter((app) => app.department === selectedDepartment)
        : data;

    if (loading) return <p>Chargement des candidatures...</p>;
    if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.topSection}>
                <h2 style={styles.title}>Internship Application</h2>
                <div style={styles.filterContainer}>
                    <label style={styles.filterLabel}>Department:</label>
                    <select
                        value={selectedDepartment}
                        onChange={(event) => setSelectedDepartment(event.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="">All Departments</option>
                        {[...new Set(data.map((app) => app.department || "Non spécifié"))].map((dept, index) => (
                            <option key={dept || `dept-${index}`} value={dept || ""}>
                                {dept || "Non spécifié"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={styles.tableContainer}>
                <div style={styles.headerRow}>
                    <span style={styles.headerCell}>Nom</span>
                    <span style={styles.headerCell}>Email</span>
                    <span style={styles.headerCell}>CV</span>
                    <span style={styles.headerCell}>Diplôme</span>
                    <span style={styles.headerCell}>Durée</span>
                    <span style={styles.headerCell}>Lettre</span>
                    <span style={styles.headerCell}>Type</span>
                    <span style={styles.headerCell}>Action</span>
                </div>

                {filteredApplications.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "20px" }}>Aucune candidature trouvée.</p>
                ) : (
                    filteredApplications.map((app) => (
                        <div key={`app-${app.id}`} style={styles.row}>
                            <div style={styles.cell}>{app.username || "Non spécifié"}</div>
                            <div style={styles.cell}>{app.email || "Non spécifié"}</div>
                            <div style={styles.cell}>{app.cv || "Non spécifié"}</div>
                            <div style={styles.cell}>{app.degree || "Non spécifié"}</div>
                            <div style={styles.cell}>{app.dureedestage || "Non spécifié"}</div>
                            <div style={styles.cell}>{app.lettremotivation || "Non spécifié"}</div>
                            <div style={styles.cell}>{app.typeinternship || "Non spécifié"}</div>
                            <div style={styles.actionCell}>
                                <button
                                    style={styles.actionButton}
                                    onClick={() => handleAcceptApplication(app.id)}
                                    disabled={processingId === app.id} // Disable while processing
                                >
                                    {processingId === app.id ? "Processing..." : "Accept Application"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        padding: "20px",
        backgroundColor: "#F4F5F7",
        borderRadius: "8px",
    },
    topSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
    },
    filterContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    filterLabel: {
        fontWeight: "bold",
        fontSize: "14px",
        color: "#555",
    },
    filterSelect: {
        padding: "8px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        backgroundColor: "#fff",
        cursor: "pointer",
    },
    tableContainer: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    headerRow: {
        display: "flex",
        backgroundColor: "#F4F5F7",
        padding: "10px 15px",
        fontWeight: "bold",
        color: "#333",
    },
    headerCell: {
        flex: 1,
        textAlign: "center",
        fontSize: "14px",
    },
    row: {
        display: "flex",
        alignItems: "center",
        padding: "15px 10px",
        borderBottom: "1px solid #ddd",
    },
    cell: {
        flex: 1,
        textAlign: "center",
        fontSize: "14px",
        color: "#555",
    },
    actionCell: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    actionButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "8px 12px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "12px",
    },
};

export default ApplicationTable;
