import React, { createContext, useContext, useState } from 'react';

// Create Context
const LanguageStore = createContext();

// LanguageProvider to wrap the app and manage the language state
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('English'); // Default language is English

    // Function to toggle language
    const toggleLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
    };

    return (
        <LanguageStore.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageStore.Provider>
    );
};

// Custom hook to use LanguageContext
export const useLanguage = () => useContext(LanguageStore);
