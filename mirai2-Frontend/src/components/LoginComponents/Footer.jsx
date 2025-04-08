import React from 'react';
import { useLanguage } from '../../store/LanguageStore';

function Footer() {
    const { language } = useLanguage();

    return (
        <footer className="py-4 text-center text-gray-500 bg-[#F7F9FC]">
            &copy; 2025 MIRAI |
            <a href="#/terms" className="ml-2 hover:underline">
                {language === 'English' ? 'Terms of Use' : "Conditions d'utilisation"}
            </a> |
            <a href="#/privacy" className="ml-2 hover:underline">
                {language === 'English' ? 'Privacy Policy' : 'Politique de confidentialité'}
            </a> |
            <a href="#/about" className="ml-2 hover:underline">
                {language === 'English' ? 'About' : 'À propos'}
            </a> |
            <a href="#/brand-policy" className="ml-2 hover:underline">
                {language === 'English' ? 'Brand Policy' : 'Politique de marque'}
            </a>
        </footer>
    );
}

export default Footer;
