"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import styles from '../member.module.css'; // Use your CSS for consistent styling
import { useSearchParams } from 'next/navigation'; // To handle dynamic routing
import MemberLayout from '../Layout'; // Import your Layout component

interface Event {
  _id: string;
  name: string;
  date: string;
  place: string;
  clubId: string;
}

const Clubs = ({ params }: { params: { userId: string } }) => {
  const { userId } = params; // Extract userId from dynamic route
  const searchParams = useSearchParams(); // Access query parameters

  // Check if searchParams is null before getting 'name'
  const name = searchParams ? searchParams.get("name") || '' : ''; // Get 'name' from query string, default to empty if null

  const [events, setEvents] = useState<Event[]>([]); // New state for events
  const [interestedEvents, setInterestedEvents] = useState<string[]>([]); // State to track interested events
  const [error, setError] = useState<string | null>(null); // State to track errors
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  // Fetch events associated with the clubs
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:4000/events");
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (error) {
        setError("Failed to load events. Please try again later.");
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, [userId, name]); // Add dependencies if you need to re-fetch when `userId` or `name` changes
  
  // Handle interested button click
  const handleInterested = async (memberId: string, eventId: string) => {
    console.log("Marking as interested:", { memberId, eventId });
  
    setInterestedEvents((prev) => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  
    try {
      const response = await fetch("http://localhost:4000/interested-members/mark-as-interested", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
          eventId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to mark event as interested:", errorData);
        setSuccessMessage(null); // Reset success message if failed
      } else {
        console.log("Successfully marked event as interested");
        setSuccessMessage("Event marked as interested!");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error occurred. Please try again.");
    }
  };

  return (
    <MemberLayout userId={userId} name={name}>
      <section className={styles.eventsSection}>
        <h2>See Events</h2>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {events.length > 0 ? (
          <div className={styles.eventsGrid}> {/* New grid wrapper */}
            {events.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <h3>{event.name}</h3>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Place:</strong> {event.place}</p>
                <p><strong>Club ID:</strong> {event.clubId}</p>
                <button
                  className={styles.interestedButton}
                  onClick={() => handleInterested(userId, event._id)}
                >
                  {interestedEvents.includes(event._id) ? "Interested" : "Mark as Interested"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No events available at the moment.</p>
        )}
      </section>
    </MemberLayout>
  );
};

export default Clubs;
