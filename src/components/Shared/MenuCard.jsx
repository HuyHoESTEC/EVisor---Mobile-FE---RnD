import React from "react";

const MenuCard = ({ icon, title, onClick }) => {
    return (
        <button
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] flex flex-col items-center justify-center text-center w-full min-h-[120px] border border-gray-100"
            onClick={onClick}
        >
            <span className="text-4xl mb-2">{icon}</span>
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </button>
    );
};

export default MenuCard;