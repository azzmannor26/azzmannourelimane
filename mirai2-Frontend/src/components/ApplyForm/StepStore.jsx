import React, { createContext, useState } from "react";

export const MultiStepContext = createContext();

export const StepProvider = ({ children }) => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        fullname: "",
        establishment: "",
        degree: "",
        internshipDuration: "",
        department: "",
        internshipType: "",
        cv: null,
        motivationLetter: null,
    });

    return (
        <MultiStepContext.Provider value={{ step, setStep, userData, setUserData }}>
            {children}
        </MultiStepContext.Provider>
    );
};
