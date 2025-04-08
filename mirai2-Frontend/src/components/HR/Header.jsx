import React from "react";
import { FiSearch, FiBell } from "react-icons/fi";

const Header = () => {
    return (
        <header style={styles.header}>
            <div style={styles.leftSection}>
                <img
                    src="/src/assets/Login/logo1.png" // Chemin vers ton logo
                    alt="MIRAI Logo"
                    style={styles.logo}
                />
                <h1 style={styles.title}>Welcome to Mirai</h1>
            </div>
            <div style={styles.rightSection}>
                <FiSearch style={styles.icon} />
                <FiBell style={styles.icon} />
                <img
                    src="/src/assets/avatar.png" // Image de l'utilisateur
                    alt="Profile"
                    style={styles.profileImage}
                />
            </div>
        </header>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F5F7",
        padding: "15px 20px",
        borderBottom: "1px solid #E0E0E0",
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
    },
    logo: {
        height: "40px",
        marginRight: "10px",
    },
    title: {
        fontSize: "20px",
        color: "#333",
        margin: 0,
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    icon: {
        fontSize: "18px",
        color: "#333",
        cursor: "pointer",
    },
    profileImage: {
        width: "35px",
        height: "35px",
        borderRadius: "50%",
    },
};

export default Header;
