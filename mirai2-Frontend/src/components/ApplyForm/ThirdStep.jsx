import React, { useContext, useState } from "react";
import axios from "axios";
import { MultiStepContext } from "../../store/StepStore";

// Styled Modal component
const Modal = ({ title, message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
      <h3 className="text-2xl font-bold mb-4 text-blue-700">{title}</h3>
      <p className="text-lg text-gray-800 mb-6">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default function ThirdStep() {
  const { setStep, submitData, userData, setUserData } = useContext(MultiStepContext);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // File filter: accepts only PDFs
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const isPDF =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPDF) {
      alert("Only PDF files are allowed.");
      return;
    }

    console.log("Accepted file:", file);
    // Save file in global state
    setUserData((prev) => ({ ...prev, [fieldName]: file }));
  };

  // Check eligibility by sending only the CV to the prediction endpoint.
  // If the CV is marked as "Bad", display the modal with a clear message.
  const handleCVCheck = async () => {
    if (!userData.cv) {
      setModalMessage("Please upload your CV as a PDF.");
      setShowModal(true);
      return false;
    }

    const formData = new FormData();
    // Send only the CV for evaluation.
    formData.append("files", userData.cv);

    try {
      setUploadStatus("Checking CV eligibility...");
      const response = await axios.post("https://thecherry-mirai.hf.space/predict", formData);
      console.log("Upload Success:", response.data);

      const results = response.data.results;
      if (!results || results.length === 0) {
        setModalMessage("No prediction result received for your CV.");
        setShowModal(true);
        setUploadStatus("CV check failed.");
        return false;
      }

      // Check the CV result. Assume results[0] corresponds to the CV.
      if (results[0].is_good_or_bad.toLowerCase() === "bad") {
        setModalMessage(
          "We're sorry, but based on our evaluation, your CV does not meet the job requirements. Please review your CV and try again with a version that better reflects your relevant experience."
        );
        setShowModal(true);
        setUploadStatus("CV rejected: Your CV does not meet our requirements.");
        return false;
      } else {
        setUploadStatus("Congratulations! You've aced our document filter – your CV passed with flying colors!");
        return true;
      }
    } catch (error) {
      console.error("Error checking CV eligibility:", error);
      setModalMessage("There was an error processing your CV. Please try again.");
      setShowModal(true);
      setUploadStatus("Failed to process your CV. Please try again ❌");
      return false;
    }
  };

  // Handle the submission: run eligibility check first, then submit if accepted.
  const handleSubmit = async () => {
    const eligible = await handleCVCheck();
    if (eligible) {
      // Only call submitData() if the eligibility check passes.
      submitData();
    } else {
      console.log("Submission aborted due to CV rejection.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        Step 3: Upload Files
      </h2>

      {/* Upload CV */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload CV</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, "cv")}
          className="w-full border p-2 rounded"
        />
        {userData.cv && <p className="text-green-600 mt-2 text-sm">{userData.cv.name}</p>}
      </div>

      {/* Upload Motivation Letter */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload Motivation Letter</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, "lettremotivation")}
          className="w-full border p-2 rounded"
        />
        {userData.lettremotivation && (
          <p className="text-green-600 mt-2 text-sm">{userData.lettremotivation.name}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
        >
          Submit
        </button>
      </div>

      {uploadStatus && (
        <p
          className={`mt-4 font-semibold text-center ${
            uploadStatus.toLowerCase().includes("congratulations") ||
            uploadStatus.toLowerCase().includes("passed")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {uploadStatus}
        </p>
      )}

      {/* Display Modal if needed */}
      {showModal && (
        <Modal
          title="Notification"
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
