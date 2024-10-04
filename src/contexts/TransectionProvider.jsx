import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const TransectionContext = createContext(null);

export const TransectionProvider = ({ children }) => {
  const { user } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState([]); // Store transactions

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    const incomeQuerySnapshot = await getDocs(
      collection(db, `users/${user.uid}/incomes`)
    );
    const expenseQuerySnapshot = await getDocs(
      collection(db, `users/${user.uid}/expenses`)
    );

    let incomeTotal = 0;
    let expenseTotal = 0;
    const incomeList = [];
    const expenseList = [];

    // Fetch income data
    incomeQuerySnapshot.forEach((doc) => {
      const incomeData = doc.data();
      incomeTotal += incomeData.amount;
      incomeList.push({ id: doc.id, ...incomeData });
    });

    // Fetch expense data
    expenseQuerySnapshot.forEach((doc) => {
      const expenseData = doc.data();
      expenseTotal += expenseData.amount;
      expenseList.push({ id: doc.id, ...expenseData });
    });

    setTotalIncome(incomeTotal);
    setTotalExpense(expenseTotal);
    setCurrentBalance(Math.round((incomeTotal - expenseTotal) * 1000) / 1000);

    // Store both income and expense transactions
    setTransactions([
      ...incomeList.map((tran) => ({ ...tran, type: "Income" })),
      ...expenseList.map((tran) => ({ ...tran, type: "Expense" })),
    ]);
  }, [user]);

  const handleResetBalance = async () => {
    if (!user) return;

    const incomeQuerySnapshot = await getDocs(
      collection(db, `users/${user.uid}/incomes`)
    );
    const expenseQuerySnapshot = await getDocs(
      collection(db, `users/${user.uid}/expenses`)
    );

    const deleteIncomePromises = incomeQuerySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, `users/${user.uid}/incomes`, docSnap.id))
    );
    const deleteExpensePromises = expenseQuerySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, `users/${user.uid}/expenses`, docSnap.id))
    );

    await Promise.all([...deleteIncomePromises, ...deleteExpensePromises]);

    setTotalIncome(0);
    setTotalExpense(0);
    setCurrentBalance(0);
    setTransactions([]); // Clear the transaction list
  };

  return (
    <TransectionContext.Provider
      value={{
        totalIncome,
        totalExpense,
        currentBalance,
        transactions,
        fetchTransactions,
        handleResetBalance,
      }}
    >
      {children}
    </TransectionContext.Provider>
  );
};

export const useTransection = () => useContext(TransectionContext);
