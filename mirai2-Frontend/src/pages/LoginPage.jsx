import React from "react";
import Header from "../components/LoginComponents/Header";
import LoginForm from "../components/LoginComponents/LoginForm";
import Footer from "../components/LoginComponents/Footer";
import loginImage from "../assets/Login/imagelogin.png";
import { useLanguage } from "../store/LanguageStore";
import { Link } from "react-router-dom";

function LoginPage() {
  const { language } = useLanguage(); // Access the selected language from LanguageProvider

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-wrap lg:flex-nowrap px-8 lg:px-24 py-12 items-center gap-10">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            {language === "English" ? "Welcome to" : "Bienvenue à"}{" "}
            <span className="text-blue-600">MIRAI</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {language === "English"
              ? "Here, we believe that building a strong professional network begins with your participation. We are delighted to offer a modern and user-friendly service to ensure you have the best experience."
              : "Ici, nous croyons que construire un réseau professionnel solide commence par votre participation. Nous sommes ravis de proposer un service moderne et convivial pour vous garantir la meilleure expérience."}
          </p>
          <Link
            to={"/apply"}
            className="inline-block text-lg font-semibold text-blue-600 hover:underline transition duration-200"
          >
            {language === "English" ? "Join Now!" : "Rejoignez-nous !"}
          </Link>
          <div className="mt-8">
            <img
              src={loginImage}
              alt="Login Illustration"
              className="w-96 max-w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center items-center">
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LoginPage;
