import React from "react";
import { useNavigate } from "react-router-dom";

const InternCard = ({ id, name, email, image }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${id}`, {
            state: { id, name, email, image } // ✅ Ensure intern ID is included
        });
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white p-6 rounded-lg shadow-lg text-center cursor-pointer hover:shadow-2xl transition duration-300"
        >
            <img
                src={image}
                alt={name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm">{email}</p>
        </div>
    );
};

export default InternCard;
