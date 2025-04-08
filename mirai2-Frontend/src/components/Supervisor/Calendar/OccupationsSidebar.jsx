import React from "react";
import OccupationItem from "./OccupationItem";

const OccupationsSidebar = ({ occupations = [], onAddAvailabilityClick }) => {
    return (
        <div className="w-64 bg-white p-4 rounded shadow-md">
            {/* Button to Open Modal */}
            <button
                onClick={onAddAvailabilityClick}
                className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
            >
                My Availabilities
            </button>

            <h2 className="text-lg font-semibold mt-6 mb-4 text-gray-700">
                I am not working on
            </h2>

            {/* Render Occupation Items */}
            <div className="space-y-4">
                {Array.isArray(occupations) && occupations.length > 0 ? (
                    occupations.map((occupation, index) => (
                        <OccupationItem
                            key={index}
                            title={occupation.title}
                            location={`${new Date(occupation.start).toLocaleDateString()} - ${new Date(occupation.end).toLocaleDateString()}`}
                            color="bg-red-400"
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No unavailable periods.</p>
                )}
            </div>
        </div>
    );
};

export default OccupationsSidebar;
