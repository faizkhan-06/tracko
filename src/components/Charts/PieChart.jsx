import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTransection } from "../../contexts/TransectionProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { transactions, fetchTransactions } = useTransection();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      await fetchTransactions();
    };

    fetchData();
  }, [fetchTransactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      const totalIncome = transactions
        .filter((tran) => tran.type === "Income")
        .reduce((acc, tran) => acc + tran.amount, 0);

      const totalExpense = transactions
        .filter((tran) => tran.type === "Expense")
        .reduce((acc, tran) => acc + tran.amount, 0);

      setChartData({
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: [totalIncome, totalExpense],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Adjust width and height freely
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income vs Expense",
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg h-96 w-full">
      {" "}
      {/* Full width */}
      <Pie data={chartData} options={options} height={400} />
    </div>
  );
};

export default PieChart;
