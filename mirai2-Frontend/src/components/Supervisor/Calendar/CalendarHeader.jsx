import React from "react";

const CalendarHeader = () => {
    return (
        <div className="flex justify-between items-center mb-6">
            {/* Date Navigation */}
            <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800">
                    {"<"}
                </button>
                <h2 className="text-xl font-bold text-gray-800">October 2019</h2>
                <button className="text-gray-600 hover:text-gray-800">
                    {">"}
                </button>
            </div>

            {/* View Toggles */}
            <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                    Day
                </button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                    Week
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Month
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;

