"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../Layout";
import { useSearchParams } from "next/navigation";
import styles from "../admin.module.css";

interface EventData {
  _id?: string;
  name: string;
  date: string;
  place: string;
  clubId: string;
}

interface Member {
  _id?: string;
  name: string;
}

const Event = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const searchParams = useSearchParams();
  const name = searchParams?.get("name") ?? "";

  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [interestedMembers, setInterestedMembers] = useState<Member[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const eventData: Omit<EventData, "_id"> = {
      name: formData.get("name")?.toString() || "",
      date: formData.get("date")?.toString() || "",
      place: formData.get("place")?.toString() || "",
      clubId: formData.get("clubId")?.toString() || "",
    };

    try {
      const response = await fetch(`http://localhost:4000/events?adminId=${userId}&name=${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
        setEvents((prevEvents) => [...prevEvents, { ...eventData, _id: result._id }]);
        setHighlightedDays((prev) => [...prev, new Date(eventData.date).getDate()]);
        setShowForm(false);
      } else {
        alert("Failed to create event: " + result.message);
      }
    } catch (error: any) {
      alert("Error creating event: " + error.message);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}`, { method: "DELETE" });
      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      } else {
        alert("Failed to delete event.");
      }
    } catch (error: any) {
      alert("Error deleting event: " + error.message);
    }
  };

  const fetchEvents = async () => {
    if (!userId || !name) return;
    try {
      const response = await fetch(`http://localhost:4000/events?adminId=${userId}&name=${name}`);
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
        setHighlightedDays(data.map((event: EventData) => new Date(event.date).getDate()));
      } else {
        alert("Failed to fetch events.");
      }
    } catch (error: any) {
      alert("Error fetching events: " + error.message);
    }
  };

  const handleViewInterestedMembers = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}/interested-members`);
      if (!response.ok) throw new Error("Failed to fetch interested members");
      setInterestedMembers(await response.json());
      setShowMembers(true);
    } catch (error: any) {
      alert("Error fetching interested members: " + error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId, name]);

  return (
<AdminLayout userId={userId} name={name} profileImage="">      
  <div>
        <header className={styles.header}>
          <h2>Events Page</h2>
        </header>

        <div className={styles.eventSection}>
          <div className={styles.calendar}>
            <h3>Calendar</h3>
            <button className={styles.newEventButton} onClick={() => setShowForm(true)}>
              + Create Event
            </button>
            <div className={styles.calendarGrid}>
              {[...Array(31)].map((_, index) => (
                <div key={index} className={highlightedDays.includes(index + 1) ? styles.activeDay : styles.day}>
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className={styles.eventForm}>
              <h3>Create Event</h3>
              <input type="text" name="name" placeholder="Event Name" required />
              <input type="date" name="date" required />
              <input type="text" name="place" placeholder="Event Place" required />
              <input type="text" name="clubId" placeholder="Club ID" required />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          )}

          <div className={styles.eventList}>
            <h3>Events</h3>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} className={styles.eventItem}>
                  <h4>{event.name}</h4>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.place}</p>
                  <button onClick={() => handleViewInterestedMembers(event._id!)}>View Interested</button>
                  <button onClick={() => handleDeleteEvent(event._id!)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </div>

          {showMembers && (
            <div className={styles.membersList}>
              <h3>Interested Members</h3>
              {interestedMembers.length > 0 ? (
                interestedMembers.map((member) => <div key={member._id}>{member.name}</div>)
              ) : (
                <p>No members interested.</p>
              )}
              <button onClick={() => setShowMembers(false)}>Close</button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Event;
