"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
}

const AdminDashboard: React.FC = () => {
  const params = useParams<{ userId: string }>(); // Ensure params exists
  const userId = params?.userId || ""; // Fallback to an empty string if null
  const searchParams = useSearchParams();
  const name = searchParams?.get("name") || "User"; // Ensure searchParams is not null

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return; // Exit if userId is not defined

      try {
        console.log(`Fetching notifications for userId: ${userId}`);
        const response = await axios.get<Notification[]>(
          `http://localhost:4000/notifications/user/${userId}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId: string) => {
    if (!notificationId) return;

    try {
      await axios.patch(`http://localhost:4000/notifications/${notificationId}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {name}!</p>
      <div className="notification-dropdown">
        <button onClick={toggleDropdown} className="notification-icon">
          🛎️
          {notifications.filter((notif) => !notif.read).length > 0 && (
            <span className="badge">{notifications.filter((notif) => !notif.read).length}</span>
          )}
        </button>

        {isOpen && (
          <div className="dropdown-content">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((notification) =>
                notification._id ? (
                  <div
                    key={notification._id}
                    className={`notification-item ${notification.read ? "read" : ""}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    {notification.message || "No message"}
                  </div>
                ) : null
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;