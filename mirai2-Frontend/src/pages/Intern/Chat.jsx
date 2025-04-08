import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FiSend, FiPaperclip } from "react-icons/fi";

// Import your Sidebar and Navbar
import Sidebar from "../../constants/Sidebar";
import Navbar from "../../components/InternSpace/Navbar";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [chatPartners, setChatPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const messagesEndRef = useRef(null);

  // 1. Grab user info
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      console.error("⚠️ No authentication token found in localStorage.");
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.userId);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error("⚠️ Error parsing user data:", error);
      }
    } else {
      console.error("⚠️ No user data found in localStorage.");
    }
  }, []);

  // 2. Fetch chat partners
  useEffect(() => {
    if (!userId || !userRole) return;
    console.log(`🔍 Fetching chat partners for ${userRole}: ${userId}`);

    const token = localStorage.getItem("token");
    let apiUrl;

    if (userRole === "STAGIAIRE") {
      apiUrl = `http://localhost:8080/api/stagiaire/${userId}/supervisor`;
    } else if (userRole === "SUPERVISEUR") {
      apiUrl = `http://localhost:8080/api/supervisor/${userId}/interns`;
    }

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("✅ Chat partners API Response:", response.data);
        if (userRole === "STAGIAIRE") {
          // If your /stagiaire/... endpoint only returns { supervisorId: 123 },
          // then it won't have the supervisor's username. If you also updated
          // that endpoint to include the username, adapt accordingly:
          const partner = {
            id: response.data.supervisorId,
            // e.g., username: response.data.supervisorUsername
          };
          setChatPartners([partner]);
          setSelectedPartner(partner);

        } else if (userRole === "SUPERVISEUR") {
          // Now the response is an array of { id, username }
          const interns = response.data.map((item) => ({
            id: item.id,
            username: item.username
          }));
          setChatPartners(interns);

          // Optional: auto-select the first intern
          if (interns.length > 0) {
            setSelectedPartner(interns[0]);
          }
        }
      })
      .catch((error) => {
        console.error("❌ Failed to fetch chat partners:", error.response || error);
      });
  }, [userId, userRole]);

  // 3. Fetch chat history
  useEffect(() => {
    if (!userId || !selectedPartner) return;

    console.log(
      `🔍 Fetching chat history for conversation with partner ${selectedPartner.id}`
    );
    const token = localStorage.getItem("token");

    let senderId, receiverId;
    if (userRole === "SUPERVISEUR") {
      // For supervisor, we want messages from intern => supervisor
      senderId = selectedPartner.id;
      receiverId = userId;
    } else {
      // For intern, conversation is with their supervisor
      senderId = userId;
      receiverId = selectedPartner.id;
    }

    axios
      .get(`http://localhost:8080/api/history/${senderId}/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("✅ Chat history fetched:", response.data);
        if (userRole === "SUPERVISEUR") {
          setConversations((prev) => ({
            ...prev,
            [selectedPartner.id]: response.data,
          }));
        } else {
          setMessages(response.data);
        }
      })
      .catch((error) => {
        console.error("❌ Failed to fetch chat history:", error.response || error);
      });
  }, [userId, selectedPartner, userRole]);

  // 4. WebSocket connection
  useEffect(() => {
    if (!userId) return;

    console.log("🟢 Connecting WebSocket...");
    const socket = new SockJS("http://localhost:8080/api/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("🔄 STOMP Debug:", msg),

      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setIsConnected(true);

        let topic;
        if (userRole === "SUPERVISEUR") {
          topic = `/topic/private.${userId}`;
          console.log(`📩 Supervisor subscribing to: ${topic}`);
          client.subscribe(topic, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("📩 New Message:", receivedMessage);

              const partnerId =
                receivedMessage.senderId === userId
                  ? receivedMessage.receiverId
                  : receivedMessage.senderId;

              setConversations((prev) => {
                const updatedConversation = prev[partnerId]
                  ? [...prev[partnerId], receivedMessage]
                  : [receivedMessage];
                return { ...prev, [partnerId]: updatedConversation };
              });
            } catch (error) {
              console.error("❌ Failed to parse message:", error);
            }
          });
        } else if (userRole === "STAGIAIRE") {
          topic = `/topic/private.${userId}`;
          console.log(`📩 Intern subscribing to: ${topic}`);
          client.subscribe(topic, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("📩 New Message:", receivedMessage);
              setMessages((prev) => [...prev, receivedMessage]);
            } catch (error) {
              console.error("❌ Failed to parse message:", error);
            }
          });
        }

        // Register the user
        client.publish({
          destination: "/api/app/chat.addUser",
          body: JSON.stringify({
            senderId: userId,
            receiverIds: chatPartners.map((p) => p.id),
            content: `${userId} joined the chat!`,
            type: "JOIN",
          }),
        });
      },

      onStompError: (frame) => {
        console.error("⛔ Broker error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },

      onWebSocketError: (event) => {
        console.error("🚨 WebSocket connection error:", event);
      },

      onDisconnect: () => {
        console.log("❌ Disconnected from WebSocket");
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [userId, userRole, selectedPartner, chatPartners]);

  // 5. Send a message
  const sendMessage = () => {
    if (!stompClient || !isConnected) {
      console.warn("⚠️ Cannot send message: WebSocket is not connected.");
      return;
    }
    if (!newMessage.trim()) return;

    let receiverId;
    if (userRole === "SUPERVISEUR") {
      if (!selectedPartner) {
        console.warn("⚠️ No intern selected to send the message.");
        return;
      }
      receiverId = selectedPartner.id;
    } else {
      // STAGIAIRE
      if (!selectedPartner) {
        console.warn("⚠️ No supervisor available.");
        return;
      }
      receiverId = selectedPartner.id;
    }

    const chatMessage = {
      senderId: userId,
      receiverId: receiverId,
      content: newMessage,
      type: "TEXT",
    };

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });

    // Update local state right away for a “snappy” UI
    if (userRole === "SUPERVISEUR") {
      setConversations((prev) => {
        const updatedConversation = prev[receiverId]
          ? [...prev[receiverId], chatMessage]
          : [chatMessage];
        return { ...prev, [receiverId]: updatedConversation };
      });
    } else {
      setMessages((prev) => [...prev, chatMessage]);
    }
    setNewMessage("");
  };

  // 6. Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversations, selectedPartner]);

  // For supervisors, render the partner list
  const renderPartnerList = () => (
    <div className="w-1/4 h-full border-r border-gray-200 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Interns</h2>
      <ul className="space-y-2">
        {chatPartners.map((partner) => (
          <li
            key={partner.id}
            className={`p-2 cursor-pointer rounded-lg ${
              selectedPartner && selectedPartner.id === partner.id
                ? "bg-purple-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedPartner(partner)}
          >
            {/* Display the intern’s username, fallback if needed */}
            {partner.username ? partner.username : `Intern ${partner.id}`}
          </li>
        ))}
      </ul>
    </div>
  );

  // Decide which conversation to show
  const currentConversation =
    userRole === "SUPERVISEUR" && selectedPartner
      ? conversations[selectedPartner.id] || []
      : messages;

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Right-side content area */}
      <div className="ml-64 flex flex-col w-full h-full">
        <Navbar />

        {/* Main Wrapper */}
        <div className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {userRole === "STAGIAIRE"
                ? "Chat with Supervisor"
                : selectedPartner
                ? `Chat with ${selectedPartner.username || "Intern " + selectedPartner.id}`
                : "Chat"}
            </h1>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex overflow-hidden space-x-4">
            {/* For SUPERVISEUR, show partner list */}
            {userRole === "SUPERVISEUR" && renderPartnerList()}

            {/* Messages Area */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
              {/* Messages list */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {currentConversation.length === 0 ? (
                  <p className="text-gray-500 text-center mt-4">
                    No messages yet
                  </p>
                ) : (
                  currentConversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === userId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 max-w-[75%] md:max-w-[60%] rounded-xl text-white ${
                          msg.senderId === userId
                            ? "bg-purple-600"
                            : "bg-gray-500"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                        {msg.timestamp && (
                          <div className="text-xs text-gray-200 mt-1 text-right">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="bg-gray-50 p-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {/* File Attachment Icon (Optional) */}
                  <button
                    type="button"
                    className="text-gray-600 hover:text-purple-600 transition"
                  >
                    <FiPaperclip size={20} />
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <button
                    onClick={sendMessage}
                    className={`bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center transition ${
                      !isConnected ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isConnected}
                  >
                    <FiSend size={20} />
                    <span className="ml-2">
                      {isConnected ? "Send" : "Connecting..."}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Chat;
