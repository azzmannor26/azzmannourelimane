// SecondStep.jsx
import React, { useContext } from "react";
import { MultiStepContext } from "../../store/StepStore";

export default function SecondStep() {
  const { setStep, userData, setUserData } = useContext(MultiStepContext);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        Step 2: Internship Details
      </h2>

      <select
        value={userData.internshipDuration || ""}
        onChange={(e) => setUserData({ ...userData, internshipDuration: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="" disabled>
          Select Internship Duration
        </option>
        <option value="1month">1 month</option>
        <option value="2months">2 months</option>
        <option value="3months">3 months</option>
      </select>

      <select
        value={userData.department || ""}
        onChange={(e) => setUserData({ ...userData, department: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="" disabled>
          Select Department
        </option>
        <option value="Software Development">Software Development</option>
        <option value="IT Support">IT Support</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
      </select>

      <select
        value={userData.internshipType || ""}
        onChange={(e) => setUserData({ ...userData, internshipType: e.target.value })}
        className="w-full border p-2 rounded mb-6"
      >
        <option value="" disabled>
          Select Internship Type
        </option>
        <option value="PFA">PFA</option>
        <option value="PFE">PFE</option>
        <option value="Research Internship">Research Internship</option>
      </select>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
