import React from "react";
import { FiGrid, FiUsers, FiSettings } from "react-icons/fi";
import { MdOutlineGroups, MdOutlineTaskAlt, MdOutlineMeetingRoom } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineFolder } from "react-icons/ai";
import logo from "../../assets/Login/logo1.png";
import lamp from "../../assets/lamp.png"; // Path to your lamp image

const Sidebar = () => {
    return (
        <div className="w-64 bg-white h-screen shadow-md flex flex-col justify-between p-5">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Logo" className="w-20 mb-6" />
            </div>

            {/* Navigation */}
            <nav className="flex-1">
                <ul className="space-y-6">
                    <li>
                        <a
                            href="#"
                            className="flex items-center text-purple-600 font-semibold hover:text-purple-800"
                        >
                            <FiGrid className="mr-3" size={20} />
                            Documents
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-purple-800">
                            <MdOutlineGroups className="mr-3" size={20} />
                            Teams
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-purple-800">
                            <FiUsers className="mr-3" size={20} />
                            Employees
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-purple-800">
                            <AiOutlineFolder className="mr-3" size={20} />
                            Projects
                        </a>
                    </li>
                </ul>

                <hr className="my-6 border-gray-200" />

                <ul className="space-y-6">
                    <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-purple-800">
                            <MdOutlineMeetingRoom className="mr-3" size={20} />
                            Meetings
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-purple-800">
                            <HiOutlineDocumentText className="mr-3" size={20} />
                            Tasks
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-600 hover:text-purple-800">
                            <FiSettings className="mr-3" size={20} />
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Bottom Lamp Image */}
            <div className="flex flex-col items-center mb-4">
                <img
                    src={lamp}
                    alt="Lamp"
                    className="w-41 h-40" /* Adjusted size to make it bigger */
                />
                <button className="text-purple-600 mt-2 text-sm font-medium hover:underline">
                    Share Your Thoughts
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
