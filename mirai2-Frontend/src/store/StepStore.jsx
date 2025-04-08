import React, { createContext, useState } from "react";
import axios from "axios";

export const MultiStepContext = createContext();

export const MultiStepProvider = ({ children }) => {
  const [currentStep, setStep] = useState(1);
  const [userData, setUserData] = useState({
    fullname: "",
    email: "", // Added email field
    establishment: "",
    degree: "",
    internshipDuration: "",
    department: "",
    internshipType: "",
    cv: null,
    lettremotivation: null, // Files will be stored here
  });

  const [finalData, setFinalData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const submitData = async () => {
    const formData = new FormData();

    // Append text fields
    formData.append("username", userData.fullname);
    formData.append("email", userData.email); // Append email
    formData.append("department", userData.department);
    formData.append("degree", userData.degree);
    formData.append("dureestage", userData.internshipDuration);
    formData.append("typeInternship", userData.internshipType);

    // Append files if they exist
    if (userData.cv instanceof File) {
      formData.append("cv", userData.cv);
    }
    if (userData.lettremotivation instanceof File) {
      formData.append("lettremotivation", userData.lettremotivation);
    }

    try {
      console.log("Données envoyées au backend :", Object.fromEntries(formData));
      const response = await axios.post("http://localhost:8080/api/api/submitForm", formData);
      console.log("Réponse du serveur :", response.data);
      setSuccessMessage("Formulaire soumis avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de la soumission :",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <MultiStepContext.Provider
      value={{
        currentStep,
        setStep,
        userData,
        setUserData,
        finalData,
        submitData,
        successMessage,
      }}
    >
      {children}
    </MultiStepContext.Provider>
  );
};
