import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, format, isSameMonth, isSameDay } from "date-fns";

const CalendarView = ({ occupations }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Tracks the selected month

    // Get all days in the current month
    const generateCalendar = () => {
        const startMonth = startOfMonth(currentMonth);
        const endMonth = endOfMonth(currentMonth);
        const startDate = startOfWeek(startMonth); // Week starts from Monday
        const endDate = endOfWeek(endMonth);

        let days = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    };

    // I found the problem here it wasn't working matching backend u had smthg like :(occ) => date >= new Date(occ.from) && date <= new Date(occ.to)
    const isReserved = (date) => {
        return occupations.some(
            (occ) => date >= new Date(occ.start) && date <= new Date(occ.end)
        );
    };

    // Handle month navigation
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const days = generateCalendar();

    return (
        <div className="bg-white rounded shadow-md p-4">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">&lt;</button>
                <h2 className="text-xl font-bold text-gray-800">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">&gt;</button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                    <div key={day} className="p-2">{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px">
                {days.map((day, index) => {
                    const reserved = isReserved(day);
                    return (
                        <div
                            key={index}
                            className={`relative p-4 h-20 border ${
                                isSameMonth(day, currentMonth) ? "bg-white" : "bg-gray-100"
                            }`}
                        >
                            <span className="absolute top-1 left-1 text-xs text-gray-400">
                                {format(day, "d")}
                            </span>
                            {reserved && (
                                <div className="absolute inset-0 bg-red-200 opacity-50 rounded"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
