import React from "react";

const Card = ({ title, value, buttonText, onClick, red }) => (
  <div className="bg-white-100 text-black-100 shadow-2xl rounded-lg p-6 flex flex-col items-center justify-between w-full transform transition duration-500 hover:scale-105">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <h4
      className={`text-2xl font-bold mb-4 ${
        red ? "text-red-500" : "text-green-500"
      }`}
    >
      ₹{new Intl.NumberFormat().format(value)}
    </h4>
    <button
      className="text-black-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
      onClick={onClick}
    >
      {buttonText}
    </button>
  </div>
);

export default React.memo(Card);
