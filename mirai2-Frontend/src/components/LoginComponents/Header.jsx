// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useLanguage } from '../../store/LanguageStore'; // Import Language Context
import logo from "../../assets/Login/logo1.png"; // Update the path as needed
import { Link, useLocation } from 'react-router-dom'; // Import useLocation

function Header() {
    const { language, toggleLanguage } = useLanguage();
    const location = useLocation(); // Get current path

    // Determine the button text and link based on the current path
    const isApplyPage = location.pathname === '/apply';
    const isLoginPage = location.pathname === '/login';

    const buttonText = isApplyPage
        ? (language === 'English' ? 'Login' : 'Connexion')
        : (language === 'English' ? 'Apply now' : 'Postuler maintenant');

    const buttonLink = isApplyPage ? '/login' : '/apply';

    return (
        <header className="flex justify-between items-center px-10 py-4 bg-[#F7F9FC]">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
                <img src={logo} alt="MIRAI Logo" className="w-10 h-10" />
                <span className="text-xl font-bold text-blue-600">MIRAI</span>
            </div>

            {/* Navigation Section */}
            <div className="flex items-center space-x-6">
                {/* Language Selector */}
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => toggleLanguage(e.target.value)}
                        className="text-black font-normal text-base cursor-pointer bg-transparent focus:outline-none"
                    >
                        <option value="English">English</option>
                        <option value="French">French</option>
                    </select>
                </div>

                <Link
                    to={buttonLink}
                    className="px-4 py-2 bg-white border border-[#2563EB] text-[#2563EB] rounded-full font-medium text-base hover:shadow-md transition"
                >
                    {buttonText}
                </Link>
            </div>
        </header>
    );
}

export default Header;
