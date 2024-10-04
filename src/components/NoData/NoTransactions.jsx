import React from "react";
import transactions from "../../assets/transactions.svg";

const NoTransactions = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 text-gray-400">
      <img
        src={transactions}
        alt="No Transactions"
        className="h-80 mb-6 opacity-80 transition-opacity duration-300 hover:opacity-100"
      />
      <h1 className="text-lg text-center bg-black-100 px-4 py-2 rounded-lg shadow-lg">
        You Have No Transactions Currently
      </h1>
    </div>
  );
};

export default NoTransactions;
