import React, { useContext } from "react";
import { MultiStepContext } from "../store/StepStore.jsx";
import FirstStep from "../components/ApplyForm/FirstStep";
import SecondStep from "../components/ApplyForm/SecondStep";
import ThirdStep from "../components/ApplyForm/ThirdStep";
import Header from "../components/LoginComponents/Header.jsx"; // Proper Header import
import Footer from "../components/LoginComponents/Footer.jsx"; // Proper Footer import

export default function ApplyPage() {
    const { currentStep } = useContext(MultiStepContext);

    // Function to render the appropriate step based on currentStep
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <FirstStep />;
            case 2:
                return <SecondStep />;
            case 3:
                return <ThirdStep />;
            default:
                return <div className="text-red-500">Unknown Step</div>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
            {/* Header Section */}
            <Header />

            {/* Main Content Section */}
            <main className="flex-1 flex justify-center items-center bg-bg-[#F7F9FC] px-4">
                <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
                    {renderStep()}
                </div>
            </main>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
