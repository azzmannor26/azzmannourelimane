import React, { useState, useEffect } from "react";
import { FiGrid, FiSettings } from "react-icons/fi";
import { MdOutlineSupervisorAccount, MdOutlineChat, MdOutlineWork } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineProject } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Login/logo1.png";
import lamp from "../assets/lamp.png";
import { useAuthStore } from "../store/authStore"; // Import the Zustand store

// Role-based route configurations
const roleRoutes = {
  STAGIAIRE: [
    { label: "Dashboard", icon: FiGrid, path: "/interndash" },
    { label: "Documents", icon: HiOutlineDocumentText, path: "/documents" },
    { label: "Projects", icon: AiOutlineProject, path: "/projects" },
    { label: "My Supervisor", icon: MdOutlineSupervisorAccount, path: "/supervisor" },
    { label: "Chat", icon: MdOutlineChat, path: "/chat" },
    { label: "Internship", icon: MdOutlineWork, path: "/internship" },
   // { label: "Settings", icon: FiSettings, path: "/settings" },
  ],
  SUPERVISEUR: [
    { label: "Dashboard", icon: FiGrid, path: "/supervisordashboard" },
    { label: "My Interns", icon: HiOutlineDocumentText, path: "/myinterns" },
    { label: "Reports", icon: AiOutlineProject, path: "/reports" },
    { label: "My Availabilities", icon: MdOutlineSupervisorAccount, path: "/availabilities" },
    { label: "Chat", icon: MdOutlineChat, path: "/chat" },
  ],
  RH: [
    { label: "Dashboard", icon: FiGrid, path: "/RHdashboard" },
    { label: "Applications", icon: HiOutlineDocumentText, path: "/HR" },
    { label: "Supervisors", icon: AiOutlineProject, path: "/sup" },
    { label: "Interns", icon: MdOutlineSupervisorAccount, path: "/interns" },
    { label: "Documents", icon: MdOutlineWork, path: "/docs" },
  ],
};

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState(""); // Active section state
  const navigate = useNavigate();
  const location = useLocation();

  const { role } = useAuthStore(); // Get the dynamic role from the Zustand store

  useEffect(() => {
    // Map paths to their respective labels for active section tracking
    const pathToSection = roleRoutes[role]?.reduce((map, route) => {
      map[route.path] = route.label;
      return map;
    }, {});
    setActiveSection(pathToSection?.[location.pathname] || "Dashboard");
  }, [location.pathname, role]);

  const handleSectionClick = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };

  return (
    <div className="w-64 bg-white h-screen fixed top-0 left-0 shadow-md flex flex-col justify-between p-5 overflow-y-auto">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Logo" className="w-20 mb-6" />
        {/* Uncomment below line to display the role */}
        {/* <h2 className="text-lg font-bold text-gray-800 capitalize">{role}</h2> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-6">
          {roleRoutes[role]?.map((route, index) => (
            <React.Fragment key={route.label}>
              <li>
                <a
                  onClick={() => handleSectionClick(route.label, route.path)}
                  className={`flex items-center ${
                    activeSection === route.label
                      ? "text-purple-600 font-bold"
                      : "text-gray-600 font-normal"
                  } hover:text-purple-800 cursor-pointer`}
                >
                  <route.icon className="mr-3" size={20} />
                  {route.label}
                </a>
              </li>
              {/* Add a divider after the first 4 items */}
              {index === 3 && <hr className="my-6 border-gray-200" />}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* Bottom Lamp Image */}
      <div className="flex flex-col items-center mb-4">
        <img src={lamp} alt="Lamp" className="w-41 h-40" />
        {role !== "RH" && (
        <button
          onClick={() => navigate("/thoughts")}
          className="text-purple-600 mt-2 text-sm font-medium hover:underline"
        >
          Share Your Thoughts
        </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
