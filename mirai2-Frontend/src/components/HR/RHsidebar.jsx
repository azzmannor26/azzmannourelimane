import React, { useState } from "react";
import { FiGrid, FiUsers } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdOutlineGroups } from "react-icons/md";
import { Link } from "react-router-dom"; // Import de Link pour la navigation
import logo from "../../assets/Login/logo1.png"; // Assurez-vous que le chemin du logo est correct.

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState("Documents"); // État pour l'élément actif

    // Fonction pour gérer le clic sur un élément
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return (
        <div style={styles.sidebar}>
            {/* Logo */}
            <div style={styles.logoContainer}>
                <img src={logo} alt="Logo" style={styles.logo} />
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    <li>
                        <Link
                            to="/docs"
                            style={{
                                ...styles.link,
                                color: activeItem === "Documents" ? "#6A5ACD" : "#8A8A8A",
                            }}
                            onClick={() => handleItemClick("Documents")}
                        >
                            <HiOutlineDocumentText style={styles.icon} />
                            Documents
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/HR"
                            style={{
                                ...styles.link,
                                color: activeItem === "Applications" ? "#6A5ACD" : "#8A8A8A",
                            }}
                            onClick={() => handleItemClick("Applications")}
                        >
                            <FiGrid style={styles.icon} />
                            Applications
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/sup"
                            style={{
                                ...styles.link,
                                color: activeItem === "Supervisors" ? "#6A5ACD" : "#8A8A8A",
                            }}
                            onClick={() => handleItemClick("Supervisors")}
                        >
                            <MdOutlineGroups style={styles.icon} />
                            Supervisors
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/interns"
                            style={{
                                ...styles.link,
                                color: activeItem === "Interns" ? "#6A5ACD" : "#8A8A8A",
                            }}
                            onClick={() => handleItemClick("Interns")}
                        >
                            <FiUsers style={styles.icon} />
                            Interns
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

// Styles
const styles = {
    sidebar: {
        width: "220px",
        backgroundColor: "#FFFFFF",
        height: "100vh",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        fontFamily: "Arial, sans-serif",
    },
    logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "40px",
    },
    logo: {
        width: "60px",
    },
    navList: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
    },
    link: {
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "500",
        marginBottom: "30px",
        transition: "color 0.3s",
    },
    icon: {
        marginRight: "12px",
        fontSize: "20px",
    },
};

export default Sidebar;
