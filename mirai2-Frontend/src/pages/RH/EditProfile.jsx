import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../constants/Sidebar.jsx";
import Navbar from "../../components/InternSpace/Navbar.jsx";
import { useUser } from "../../store/UserContext"; // Import UserContext

const EditProfile = () => {
  const { profileImage, setProfileImage } = useUser(); // Get user image state

  const [profile, setProfile] = useState({
    profileImage: "", // URL or File object
    fullName: "Not Available",
    email: "",
    phoneNumber: "",
    city: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMessage("");
  
    try {
      const response = await axios.get("http://localhost:8080/api/stagiaire-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  // Ensure token is included
          "Content-Type": "application/json"
        },
        withCredentials: true, // Include credentials
      });
  
      const data = response.data;
      console.log("Fetched profile:", data);
  
      setProfile({
        profileImage: data.profileImage || "https://i.pravatar.cc/150?img=5",
        fullName: data.username || "Not Available",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        city: data.city || "",
        department: data.department || "",
      });
  
    } catch (err) {
      console.error("Error fetching profile:", err);
      setErrorMessage("Failed to load profile. Please try again.");
    }
  
    setLoading(false);
  };
  

  // ✅ FIX: Properly define handleChange function
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profileImage: file });
      setProfileImage(URL.createObjectURL(file)); // Update Navbar immediately
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    const formData = new FormData();
    formData.append(
      "profile",
      JSON.stringify({
        username: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        city: profile.city,
        department: profile.department,
      })
    );
  
    if (profile.profileImage instanceof File) {
      formData.append("profileImage", profile.profileImage);
    }
  
    try {
      const response = await axios.put(
        "http://localhost:8080/api/stagiaire-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Add token
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ Ensure credentials are sent
        }
      );
  
      console.log("Profile updated successfully:", response.data);
      fetchProfile();
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("Failed to update profile. Try again.");
    }
  };
  

  let displayedImageSrc = profile.profileImage instanceof File
    ? URL.createObjectURL(profile.profileImage)
    : `http://localhost:8080/api${profile.profileImage}`;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-start mt-8">
          <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Edit Profile
            </h2>

            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            <div className="flex justify-center mb-6 relative">
              <img
                src={displayedImageSrc}
                alt="Profile"
                className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
              />
              <label className="absolute bottom-0 right-28 bg-purple-600 text-white p-1 rounded-full cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                ✎
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Phone Number</label>
                  <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">City</label>
                  <input type="text" name="city" value={profile.city} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter your city" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Department</label>
                  <input type="text" name="department" value={profile.department} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter your department" />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => (window.location.href = "/interndash")} className="px-4 py-2 border rounded-lg text-purple-600 border-purple-600 hover:bg-purple-50">
                  Back to Dashboard
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
