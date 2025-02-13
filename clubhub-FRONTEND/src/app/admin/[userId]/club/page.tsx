"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import AdminLayout from '../Layout'; // Import the AdminLayout to reuse the sidebar
import styles from '../admin.module.css'; // Use your CSS for consistent styling
import { useRouter, useSearchParams } from 'next/navigation'; // To get query params and router

const Club = ({ params }: { params: { userId: string } }) => {
  const { userId } = params || {}; // Ensure userId exists in params
  const searchParams = useSearchParams(); // Access the query parameters
  const name = searchParams?.get("name") ?? ''; // Default to empty string if null or undefined

  const [clubs, setClubs] = useState<any[]>([]); // Ensure proper typing
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('/admin/adminpicture.jpg');

  const router = useRouter();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/clubs/admin?adminId=${userId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setClubs(data);
        } else {
          setError('Failed to load clubs or data is invalid.');
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError('Could not load clubs.');
      }
    };

    if (userId) {
      fetchClubs();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/auth/users/${userId}`);
        const data = await res.json();
        if (data?.profileImage) {
          setProfileImage(data.profileImage);
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const handleCreateClub = () => {
    setShowForm(true);
    setPending(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const numPeople = parseInt(numberOfPeople, 10);
    if (isNaN(numPeople) || numPeople < 1 || numPeople > 100) {
      setError('Number of members must be between 1 and 100.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/clubs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clubName,
          description: description,
          adminId: userId,
          numberOfPeople: numPeople,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create the club');
      }

      const createdClub = await res.json();
      setClubs((prevClubs) => [...prevClubs, createdClub]);
      setPending(true);
      setShowForm(false);
      setError('');
    } catch (err) {
      console.error('Error creating club:', err);
      setError('Failed to create the club.');
    }
  };

  const handleApply = (clubId: string) => {
    window.location.href = `/admin/${userId}/club/${clubId}/applications?name=${name}`;
  };

  return (
    <AdminLayout userId={userId} name={name || 'Default Name'} profileImage={profileImage}>
      <header className={styles.header}>
        <h2>Club Page</h2>
        <div className={styles.adminInfo}>
          <span>{name}</span>
          <img src={profileImage} alt="Admin Avatar" className={styles.adminAvatar} />
        </div>
      </header>
  
      <div className={styles.formSection}>
        {!showForm && !pending && (
          <button className={styles.createClubButton} onClick={handleCreateClub}>
            Create New Club
          </button>
        )}
  
        {showForm && (
          <div className={styles.clubDetails}>
            <h3 className={styles.sectionHeader}>Create New Club</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div>
                  <label>Name of Club </label>
                  <input
                    type="text"
                    placeholder="Enter club name"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    required
                  />
                </div>
              </div>
  
              <div className={styles.row}>
                <div>
                  <label>Description of Club </label>
                  <textarea
                    placeholder="Enter club description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
  
              <div className={styles.row}>
                <div>
                  <label>Number of People </label>
                  <input
                    type="number"
                    placeholder="Enter number of members"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    required
                    min="1"
                    max="100"
                  />
                </div>
              </div>
  
              {error && <p className={styles.error}>{error}</p>}
  
              <div className={styles.buttons}>
                <button type="submit" className={styles.saveButton}>Submit Offer</button>
              </div>
            </form>
          </div>
        )}
  
        {pending && (
          <div className={styles.pendingMessage}>
            <p>Your club offer is pending, waiting for member applications.</p>
          </div>
        )}
  
        <div className={styles.clubList}>
          <h3>Clubs Created:</h3>
          {clubs.length > 0 ? (
            clubs.map((club) => (
              <div key={club._id} className={styles.clubCard}>
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                <p><strong>Members:</strong> {club.currentMembers ?? 0}/{club.numberOfPeople ?? 0}</p>
                <button className={styles.applyButton} onClick={() => handleApply(club._id)}>
                  Manage Applications
                </button>
              </div>
            ))
          ) : (
            <p>No clubs created yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
  
};

export default Club;
