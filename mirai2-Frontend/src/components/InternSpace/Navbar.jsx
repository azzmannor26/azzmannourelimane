import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserContext"; // Import UserContext
import { useAuthStore } from "../../store/authStore"; // Import Zustand store

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const { user, role, logout } = useAuthStore();
  const username = user?.username || "User";
  const { profileImage } = useUser(); // Get profile image from UserContext

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New task assigned: Complete report", isRead: false },
    { id: 2, message: "You have a new chat message", isRead: false },
    { id: 3, message: "Your supervisor approved your report", isRead: true },
  ]);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleNotification = () => setIsNotificationOpen((prev) => !prev);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        isNotificationOpen
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isNotificationOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex justify-end items-center py-4 px-6 bg-gray-50">
      <div className="flex items-center space-x-6">
        {/* Icons Container */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <button className="text-gray-600 hover:text-black transition duration-300 flex items-center">
            <FiSearch size={20} />
          </button>

          {/* Notification Icon */}
          <div className="relative" ref={notificationRef}>
            <button
              className="text-gray-600 hover:text-black transition duration-300 flex items-center"
              onClick={toggleNotification}
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications
                  </h3>
                </div>
                <ul className="py-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="text-gray-500 text-center p-4">
                      No new notifications
                    </li>
                  ) : (
                    notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className={`flex items-start px-4 py-3 ${
                          notif.isRead
                            ? "bg-gray-100 text-gray-600"
                            : "bg-purple-50 text-purple-700"
                        } hover:bg-gray-200 rounded-md cursor-pointer`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="mr-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              notif.isRead ? "bg-gray-300" : "bg-purple-500"
                            }`}
                          ></div>
                        </div>
                        <div className="text-sm">
                          <p>{notif.message}</p>
                          <span className="text-xs text-gray-400">Just now</span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <div className="p-4 border-t text-center">
                  <button
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            className="w-10 h-10 rounded-full cursor-pointer"
            src={profileImage} // ✅ Using profile image from UserContext
            alt="User Avatar"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <div className="p-4 border-b">
                <p className="text-sm font-semibold text-gray-800">{username}</p>
              </div>
              <ul className="py-2">
                {role === "STAGIAIRE" && (
                  <li
                    onClick={() => navigate("/edit-profile")}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-600 transition duration-200"
                  >
                    <FiUser className="mr-3" size={18} />
                    Edit Profile
                  </li>
                )}
                <li
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer transition duration-200"
                >
                  <FiLogOut className="mr-3" size={18} />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
