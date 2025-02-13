"use client";
import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import PubNub from "pubnub"; // Correct import
import "./ChatPage.css";

export default function ChatPage() {
  const [pubnubInstance, setPubnubInstance] = useState<PubNub | null>(null);
  const [messages, setMessages] = useState<{ messageId: string; text: string; senderId: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const userId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const response = await fetch("http://localhost:4000/chats?channel=club_channel");
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };
    fetchMessageHistory();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/generateToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error("Token fetch failed");
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching PubNub token:", error);
      }
    };
    fetchToken();
  }, [userId]);

  useEffect(() => {
    if (!token) return;

    const setupPubNub = () => {
      const pubnub = new PubNub({
        publishKey: "pub-c-92bc0c14-6c9c-4bf6-afe3-61e3c4d811bd",
        subscribeKey: "sub-c-aab62ae9-37e6-4cc0-b557-0417be0a34cb",
        uuid: userId,
        authKey: token,
      });
      setPubnubInstance(pubnub);

      pubnub.subscribe({ channels: ["club_channel"] });

      pubnub.addListener({
        message: (event) => {
          console.log("New message received:", event); // Debugging log
          const messageText = (event.message as { text: string }).text;
          setMessages((prevMessages) => [
            ...prevMessages,
            { messageId: uuidv4(), text: messageText, senderId: event.publisher ?? "unknown" },
          ]);
        },
      });
    };

    setupPubNub();
  }, [token, userId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !pubnubInstance) return;

    try {
      await pubnubInstance.publish({
        channel: "club_channel",
        message: { text: newMessage },
      });

      await fetch("http://localhost:4000/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: uuidv4(),
          senderId: userId,
          text: newMessage,
          channel: "club_channel",
        }),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Club Chat</h1>
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`chat-bubble ${msg.senderId === userId ? "own" : "other"}`}
            >
              {msg.text}
            </div>
          ))
        ) : (
          <div className="chat-bubble">No messages yet</div>
        )}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
}
