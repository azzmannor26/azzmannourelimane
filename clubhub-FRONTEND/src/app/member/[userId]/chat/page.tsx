"use client";
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import "./chat.css";

// Dynamically import PubNub without SSR
import * as PubNub from 'pubnub'; // Ensure correct import

export default function ChatPage() {
  const [pubnubInstance, setPubnubInstance] = useState<any>(null); // Proper type for pubnubInstance
  const [messages, setMessages] = useState<any[]>([]); // Ensure the state is an array
  const [newMessage, setNewMessage] = useState<string>(''); // New message input state
  const [token, setToken] = useState<string | null>(null); // Token state
  const userId = useMemo(() => uuidv4(), []); // Generate unique UUID for the session

  // Fetch message history based on channel
  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const response = await fetch('http://localhost:4000/chats?channel=club_channel', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setMessages(data); // Update the messages state
      } catch (error) {
        console.error('Error fetching message history:', error);
      }
    };

    // Fetch PubNub token once
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/generateToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          console.error('Token fetch failed:', response.statusText);
          return;
        }

        const data = await response.json();
        setToken(data.token); // Store token in state
      } catch (error) {
        console.error('Error fetching PubNub token:', error);
      }
    };

    // Fetch history and token when component mounts
    fetchMessageHistory();
    if (!token) fetchToken();
  }, [userId, token]);

  // Setup PubNub instance once the token is available
  useEffect(() => {
    if (token && !pubnubInstance) {
      const setupPubNub = async () => {
        try {
          const PubNubModule = await import('pubnub');
          const pubnub = new PubNubModule.default({
            publishKey: 'pub-c-92bc0c14-6c9c-4bf6-afe3-61e3c4d811bd',
            subscribeKey: 'sub-c-aab62ae9-37e6-4cc0-b557-0417be0a34cb',
            uuid: userId,
            authKey: token,
          });
          setPubnubInstance(pubnub);

          // Subscribe to the channel and listen for messages
          pubnub.subscribe({ channels: ['club_channel'] });
          pubnub.addListener({
            message: (event) => {
                // Assuming the message is always an object with a text property
                const messageText = (event.message as { text: string }).text;
                setMessages((prevMessages) => [
                    ...(Array.isArray(prevMessages) ? prevMessages : []),
                    { messageId: uuidv4(), text: messageText, senderId: event.publisher ?? 'unknown' },
                ]);
            },
        });
        } catch (error) {
          console.error('Error setting up PubNub:', error);
        }
      };

      setupPubNub();
    }
  }, [token, pubnubInstance, userId]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages

    // Publish message to PubNub
    if (pubnubInstance) {
      pubnubInstance.publish({
        channel: 'club_channel',
        message: { text: newMessage },
      });
    } else {
      console.error('PubNub instance is not initialized.');
    }

    // Save message to the database
    try {
      await fetch('http://localhost:4000/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: uuidv4(),
          senderId: userId,
          text: newMessage,
          channel: 'club_channel',
        }),
      });
    } catch (error) {
      console.error('Error saving message to database:', error);
    }

    // Clear the input field after sending
    setNewMessage('');
  };

  return (
    <div className="chat-page">
      <h1>Club Chat   HELLO </h1>
      <div className="chat-messages">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.messageId}>{msg.text}</div>
          ))
        ) : (
          <p>No messages yet...</p> // Show a message if there are no messages
        )}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
