import React, { useContext, useState } from "react";
import { MultiStepContext } from "../../store/StepStore.jsx";

export default function FirstStep() {
  const [degree, setDegree] = useState("");
  const { setStep, userData, setUserData } = useContext(MultiStepContext);

  const handleDegreeChange = (event) => {
    const newDegree = event.target.value;
    setDegree(newDegree);
    setUserData({ ...userData, degree: newDegree });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Step 1: Personal Info</h2>

      {/* Full Name Field */}
      <input
        type="text"
        placeholder="Full Name"
        value={userData.fullname || ""}
        onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Email Field */}
      <input
        type="email"
        placeholder="Email"
        value={userData.email || ""}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Degree Selection */}
      <select
        value={userData.degree || degree}
        onChange={handleDegreeChange}
        className="w-full border p-2 rounded mb-6"
      >
        <option value="" disabled>
          Select Degree
        </option>
        <option value="Master Degree">Master Degree</option>
        <option value="Baccalaureate">Baccalaureate</option>
        <option value="PhD Student">PhD Student</option>
      </select>

      <div className="text-right">
        <button
          onClick={() => setStep(2)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
