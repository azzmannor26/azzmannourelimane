"use client"; // Ensure this is a client-side component

import { useState, useEffect } from 'react';

const ResetPasswordPage = () => {
  const [token, setToken] = useState<string | null>(null); // Explicitly define token type as string | null
  const [newPassword, setNewPassword] = useState(''); // Store the new password entered by the user
  const [isLoading, setIsLoading] = useState(false); // To manage loading state
  const [errorMessage, setErrorMessage] = useState(''); // To store any error messages

  // Only run this on the client-side
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setErrorMessage('Invalid or missing reset token.');
    }
  }, []);

  // Function to handle password reset
  const handleResetPassword = async () => {
    if (!newPassword) {
      setErrorMessage('Password cannot be empty.');
      return; // Prevent sending request if password is empty
    }

    setIsLoading(true); // Set loading state to true while request is being made
    setErrorMessage(''); // Clear any previous error messages

    try {
      // Send new password and reset token to backend
      const res = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, ResetToken: token }), // Token from URL and new password
      });

      if (res.ok) {
        alert('Password successfully reset!'); // Notify user of success
      } else {
        const data = await res.json();
        setErrorMessage(`Error resetting password: ${data.message}`); // Handle any errors
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong. Please try again.'); // Catch and display any unexpected errors
    } finally {
      setIsLoading(false); // Remove loading state after request completes
    }
  };

  if (!token) {
    return <div>{errorMessage || "Loading..."}</div>;
  }

  return (
    <div>
      <h1>Reset Your Password</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message if any */}
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <button onClick={handleResetPassword} disabled={isLoading || !token}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </div>
  );
};

export default ResetPasswordPage;
