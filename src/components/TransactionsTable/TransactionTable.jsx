import React, { useEffect, useState } from "react";
import { useTransection } from "../../contexts/TransectionProvider";

const TransactionsTable = () => {
  const { transactions, fetchTransactions } = useTransection();
  const [sortCriteria, setSortCriteria] = useState(""); // State to store sort option
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Sort and filter transactions based on search and selected criteria
  useEffect(() => {
    let filteredTransactions = [...transactions]; // Copy transactions array to avoid mutating the original

    // Filter by search query
    if (searchQuery) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by selected criteria
    if (sortCriteria === "amount-asc") {
      filteredTransactions.sort((a, b) => a.amount - b.amount); // Sort by amount ascending
    } else if (sortCriteria === "amount-desc") {
      filteredTransactions.sort((a, b) => b.amount - a.amount); // Sort by amount descending
    } else if (sortCriteria === "date-asc") {
      filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
    } else if (sortCriteria === "date-desc") {
      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    }

    setSortedTransactions(filteredTransactions); // Update sorted and filtered transactions
  }, [sortCriteria, searchQuery, transactions]);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-4">
        All Transactions
      </h1>

      {/* Responsive Search and Sort Options */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <label className="font-semibold text-gray-600 block mb-2 sm:mb-0">
            Search:
          </label>
          <input
            type="text"
            className="w-full sm:w-64 bg-black-100 text-white-100 rounded px-4 py-2"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto">
          <label className="font-semibold text-gray-600 block mb-2 sm:mb-0">
            Sort By:
          </label>
          <select
            className="w-full sm:w-64 bg-black-100 text-white-100 rounded px-4 py-2"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="">Select</option>
            <option value="amount-asc">Amount (Low to High)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="date-desc">Date (Newest First)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white table-auto text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">
                Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-base whitespace-nowrap">
                    {transaction.name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-base whitespace-nowrap">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-base whitespace-nowrap">
                    {transaction.date
                      ? new Date(transaction.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    className={`px-4 sm:px-6 py-3 text-xs sm:text-base whitespace-nowrap font-semibold ${
                      transaction.type === "Income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center px-4 py-4 text-sm" colSpan="4">
                  No Transactions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
