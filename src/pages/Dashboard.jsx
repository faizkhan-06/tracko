import React, { useEffect, useState, useCallback } from "react";
import Card from "../components/Card/Card";
import NoTransactions from "../components/NoData/NoTransactions";
import IncomeForm from "../components/Forms/IncomeForm";
import ExpenseForm from "../components/Forms/ExpenseForm";
import { useAuth } from "../contexts/AuthProvider";
import { useTransection } from "../contexts/TransectionProvider";
import TransactionTable from "../components/TransactionsTable/TransactionTable";
import BasicLineChart from "../components/Charts/BasicLineChart";
import PieChart from "../components/Charts/PieChart";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    totalIncome,
    totalExpense,
    currentBalance,
    fetchTransactions,
    handleResetBalance,
  } = useTransection();
  const [showIncomePopup, setShowIncomePopup] = useState(false);
  const [showExpensePopup, setShowExpensePopup] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="mx-auto w-full px-4 py-6 bg-black-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Current Balance"
          value={currentBalance}
          buttonText="Reset Balance"
          red={currentBalance < 0}
          onClick={handleResetBalance}
        />
        <Card
          title="Total Income"
          value={totalIncome}
          buttonText="Add Income"
          onClick={() => setShowIncomePopup(true)}
        />
        <Card
          title="Total Expense"
          value={totalExpense}
          buttonText="Add Expense"
          onClick={() => setShowExpensePopup(true)}
          red={true}
        />
      </div>
      {totalIncome == 0 && totalExpense == 0 ? (
        <NoTransactions />
      ) : (
        <div className="bg-balck-100 shadow-lg rounded-lg p-6 my-6 mx-auto max-w-full">
          <h2 className="text-3xl font-semibold text-center text-gray-600 mb-6">
            Financial Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg">
              <BasicLineChart />
            </div>
            <div className="p-4 rounded-lg">
              <PieChart />
            </div>
          </div>
        </div>
      )}
      <TransactionTable />
      {showIncomePopup && (
        <IncomeForm closePopup={() => setShowIncomePopup(false)} />
      )}
      {showExpensePopup && (
        <ExpenseForm closePopup={() => setShowExpensePopup(false)} />
      )}
    </div>
  );
};

export default Dashboard;
