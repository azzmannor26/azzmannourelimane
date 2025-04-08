import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const authToken = localStorage.getItem("token");
        if (!authToken) {
            setError("⚠️ You must be logged in to chat.");
            return;
        }

        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `http://localhost:8080/api/bot/chat?prompt=${encodeURIComponent(input)}`, // 🔥 Check that API URL is correct
                {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true // 🔥 Ensures JWT authentication is included
                }
            );

            setMessages((prev) => [...prev, { sender: "bot", text: response.data }]);
        } catch (error) {
            console.error("🚨 Chatbot API Error:", error);
            setError("❌ Failed to fetch response. Check console logs.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-purple-800"
            >
                {isOpen ? "×" : "💬"}
            </button>

            {isOpen && (
                <div className="w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
                    {/* Header */}
                    <div className="bg-purple-600 text-white text-center py-3 rounded-t-lg font-semibold">
                        Chat with us
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-blue-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-[75%] ${
                                    msg.sender === "user"
                                        ? "bg-blue-500 text-white self-end"
                                        : "bg-purple-400 text-white self-start"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="flex items-center border-t border-gray-300 p-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center p-2">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default Chatbot;