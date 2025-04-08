import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "./authStore"; // Import role and userId from Zustand
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { role, userId } = useAuthStore(); // Get role and user ID from Zustand

  // Default profile pictures for each role
  const defaultImages = {
    STAGIAIRE: "",  // Interns start with an empty image (until they upload one)
    SUPERVISEUR: "https://media.istockphoto.com/id/1316947194/vector/messenger-profile-icon-on-white-isolated-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=1iQ926GXQTJkopoZAdYXgU17NCDJIRUzx6bhzgLm9ps=",
    RH: "https://media.istockphoto.com/id/1316947194/vector/messenger-profile-icon-on-white-isolated-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=1iQ926GXQTJkopoZAdYXgU17NCDJIRUzx6bhzgLm9ps=",
  };

  // State for profile image
  const [profileImage, setProfileImage] = useState("");

  // Effect to handle role switching correctly
  useEffect(() => {
    if (role === "STAGIAIRE" && userId) {
      // Fetch intern profile image from backend
      axios
        .get(`http://localhost:8080/api/stagiaire-profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        })
        .then((response) => {
          const fetchedImage = response.data.profileImage;
          if (fetchedImage) {
            const imageUrl = `http://localhost:8080/api${fetchedImage}`;
            setProfileImage(imageUrl);
            localStorage.setItem(`profileImage-${userId}`, imageUrl);
          }
        })
        .catch((error) => console.error("Failed to load profile image:", error));
    } else {
      // If role is not STAGIAIRE, reset to default image immediately
      setProfileImage(defaultImages[role] || "");
      localStorage.setItem(`profileImage-${userId}`, defaultImages[role] || "");
    }
  }, [role, userId]); // Runs whenever role or userId changes

  // Function to update profile image (only for STAGIAIRE)
  const updateProfileImage = (newImage) => {
    if (role === "STAGIAIRE") {
      setProfileImage(newImage);
      localStorage.setItem(`profileImage-${userId}`, newImage);
    }
  };

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage: updateProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};
