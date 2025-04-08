import React from "react";
import PropTypes from "prop-types";

const SupervisorCard = ({ name, department, email, position }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center relative hover:shadow-xl transition-shadow">
            {/* Circle Indicator */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500"></div>

            {/* Name */}
            <h3 className="text-lg font-bold text-gray-800 mt-4">{name}</h3>

            {/* Position */}
            <p className="text-sm text-gray-500 mt-1">{position || "No position assigned"}</p>

            {/* Department (Fixed from team) */}
            <p className="text-sm text-gray-400 mt-1">Department: {department || "No department assigned"}</p>

            {/* Email (Fixed mailto) */}
            {email ? (
                <p className="text-sm text-gray-600 mt-2">
                    📧 <a href={`mailto:${email}`} className="text-blue-500 hover:underline">{email}</a>
                </p>
            ) : (
                <p className="text-sm text-gray-600 mt-2">No email available</p>
            )}
        </div>
    );
};

// ✅ Define expected prop types
SupervisorCard.propTypes = {
    name: PropTypes.string.isRequired,
    department: PropTypes.string,
    email: PropTypes.string,
    position: PropTypes.string,
};

// ✅ Default values (Now using `department`)
SupervisorCard.defaultProps = {
    department: "No department assigned",
    email: "No email available",
    position: "No position assigned",
};

export default SupervisorCard;
