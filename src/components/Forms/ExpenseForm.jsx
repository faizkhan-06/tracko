import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { useTransection } from "../../contexts/TransectionProvider";

const ExpenseForm = ({ closePopup }) => {
  const { user } = useAuth();
  const { fetchTransactions } = useTransection();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    tag: "food",
  });

  // Handle form data change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Function to validate the date
  const isValidDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Check if date is in the past but within one year and not in the future
    return selectedDate >= oneYearAgo && selectedDate <= currentDate;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are filled
    if (!formData.name || !formData.amount || !formData.date) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check for date validation
    if (!isValidDate(formData.date)) {
      toast.error(
        "Please choose a valid date within the last year and not in the future."
      );
      return;
    }

    try {
      await addDoc(collection(db, `users/${user.uid}/expenses`), {
        ...formData,
        amount: parseFloat(Math.round(formData.amount * 1000) / 1000), // Ensure amount is rounded properly
      });
      toast.success("Expense Added!");
      fetchTransactions(); // Fetch updated transactions
      closePopup(); // Close popup after submission
    } catch (error) {
      toast.error("Error adding expense: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white-100 text-black-100 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          {["name", "amount", "date"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block mb-2 capitalize">{field}</label>
              <input
                type={
                  field === "amount"
                    ? "number"
                    : field === "date"
                    ? "date"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder={field === "name" ? "Expense source" : ""}
                required
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block mb-2">Tag</label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="utilities">Utilities</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-red-500 mr-4"
              onClick={closePopup}
            >
              Cancel
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
