import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../store/LanguageStore";
import { useAuthStore } from "../../store/authStore";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("STAGIAIRE"); // Toggle between Intern and Supervisor
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const { language } = useLanguage();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Zustand login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    try {
      const success = await login({ username, password });

      if (success) {
        const role = localStorage.getItem("userRole");
        switch (role) {
          case "STAGIAIRE":
            navigate("/interndash");
            break;
          case "SUPERVISEUR":
            navigate("/supervisordashboard");
            break;
          case "RH":
            navigate("/RHdashboard");
            break;
          default:
            navigate("/login");
            break;
        }
      } else {
        setError(
          language === "English"
            ? "Invalid username or password. Please try again."
            : "Nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        language === "English"
          ? "An error occurred during login. Please try again."
          : "Une erreur est survenue lors de la connexion. Veuillez réessayer."
      );
    }
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (password.length < 10) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  return (
    <div className="w-full max-w-sm bg-white/90 rounded-3xl shadow-xl p-8 space-y-6 backdrop-blur-lg">
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        {language === "English" ? "Login" : "Connexion"}
      </h2>

      {/* User Type Toggle Button */}
      <div className="flex justify-center">
        <div className="relative bg-gray-100 rounded-full w-60 h-10 flex items-center">
          <button
            className={`w-1/2 h-full rounded-full text-sm font-semibold transition-all ${
              userType === "STAGIAIRE"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("STAGIAIRE")}
          >
            {language === "English" ? "Intern" : "Stagiaire"}
          </button>
          <button
            className={`w-1/2 h-full rounded-full text-sm font-semibold transition-all ${
              userType === "SUPERVISEUR"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("SUPERVISEUR")}
          >
            {language === "English" ? "Supervisor" : "Superviseur"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="relative">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm text-lg font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
            }`}
            required
          />
          <label
            htmlFor="username"
            className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-500"
          >
            {language === "English" ? "Username" : "Nom d'utilisateur"}
          </label>
          {error && (
            <p className="text-red-500 text-sm mt-1">
              {language === "English" ? error : "Erreur: " + error}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              evaluatePasswordStrength(e.target.value);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <label
            htmlFor="password"
            className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-500"
          >
            {language === "English" ? "Password" : "Mot de passe"}
          </label>
          {password && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength === "Strong"
                  ? "text-green-500"
                  : passwordStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {language === "English" ? "Strength: " : "Force: "}
              {passwordStrength}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-600 shadow-md transition"
        >
          {language === "English" ? "Login" : "Connexion"}
        </button>
      </form>

      {/* Forgot Password */}
      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-blue-500 hover:underline text-sm font-medium"
        >
          {language === "English" ? "Forgot Password?" : "Mot de passe oublié?"}
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
