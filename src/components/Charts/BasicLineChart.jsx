import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useTransection } from "../../contexts/TransectionProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const BasicLineChart = () => {
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
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      const dates = sortedTransactions.map((transaction) => transaction.date);
      const amounts = sortedTransactions.map(
        (transaction) => transaction.amount
      );

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Amount",
            data: amounts,
            fill: false,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 0.8)",
            tension: 0.4,
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
        text: "Transactions Over Time",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg h-96 w-full">
      {" "}
      {/* Full width */}
      <Line data={chartData} options={options} height={400} />
    </div>
  );
};

export default BasicLineChart;
