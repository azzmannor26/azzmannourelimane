import React from "react";

const OccupationItem = ({ title, location, color }) => {
    return (
        <div className="flex items-center space-x-4 p-2 rounded hover:bg-gray-100">
            {/* Color Dot */}
            <div className={`w-4 h-4 rounded-full ${color}`}></div>

            {/* Event Details */}
            <div>
                <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
                <p className="text-xs text-gray-500">{location}</p>
            </div>
        </div>
    );
};

export default OccupationItem;
