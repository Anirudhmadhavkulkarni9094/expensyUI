import React, { useEffect, useState } from 'react';
import api from './axiosConfig';
import { FaCalendarAlt, FaUserFriends, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [dateData, setDateData] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalToBeReceived, setTotalToBeReceived] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get('https://expensy-rr68.onrender.com/api/expenses/fetch');
        const expensesData = response.data.expenses;
        setExpenses(expensesData);
        prepareChartData(expensesData);
        calculateTotalSpentAndToBeReceived(expensesData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExpenses();
  }, []);

  const toggleExpand = (expenseId) => {
    setExpandedExpense(expenseId === expandedExpense ? null : expenseId);
  };

  const togglePaidStatus = async (expenseId, detailIndex) => {
    try {
      const updatedExpenses = expenses.map(expense => {
        if (expense._id === expenseId) {
          const updatedSplitDetails = [...expense.splitDetails];
          updatedSplitDetails[detailIndex].hasPaid = !updatedSplitDetails[detailIndex].hasPaid;
          return { ...expense, splitDetails: updatedSplitDetails };
        }
        return expense;
      });
      setExpenses(updatedExpenses);

      await api.put(`https://expensy-rr68.onrender.com/api/expenses/update-status`, {
        expenseId,
        detailIndex,
        hasPaid: updatedExpenses.find(exp => exp._id === expenseId).splitDetails[detailIndex].hasPaid,
      });

      // Recalculate totals after updating payment status
      calculateTotalSpentAndToBeReceived(updatedExpenses);
      window.location.reload()
    } catch (error) {
      console.log('Failed to update payment status', error);
    }
  };

  // Calculate total spent and to-be-received amounts
  const calculateTotalSpentAndToBeReceived = (expensesData) => {
    let spent = 0;
    let toBeReceived = 0;

    expensesData.forEach(expense => {
      spent += expense.amount;

      expense.splitDetails.forEach(detail => {
        if (!detail.hasPaid && detail.userId !== expense.userId) {
          toBeReceived += detail.share;
        }
      });
    });

    setTotalSpent(spent);
    setTotalToBeReceived(toBeReceived);
  };

  // Prepare data for category and date-wise charts
  const prepareChartData = (expenses) => {
    const categoryWise = {};
    const dateWise = {};

    expenses.forEach((expense) => {
      // Category-wise aggregation
      categoryWise[expense.category] = (categoryWise[expense.category] || 0) + expense.amount;

      // Date-wise aggregation
      const date = new Date(expense.date).toISOString().split('T')[0];
      dateWise[date] = (dateWise[date] || 0) + expense.amount;
    });

    setCategoryData(categoryWise);
    setDateData(dateWise);
  };

  // Chart data configuration for total spent vs. to-be-received
  const totalSpentVsReceivedData = {
    labels: ['Total Spent', 'Total To Be Received'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [totalSpent, totalToBeReceived],
        backgroundColor: ['#4CAF50', '#FF5722'],
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Amount Spent (₹)',
        data: Object.values(categoryData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const dateChartData = {
    labels: Object.keys(dateData),
    datasets: [
      {
        label: 'Amount Spent (₹)',
        data: Object.values(dateData),
        fill: true,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-8">Expense List & Analysis</h2>

      {/* Summary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Category-wise Spending</h3>
          <Pie data={categoryChartData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Date-wise Spending</h3>
          <Line data={dateChartData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Total Spent vs To Be Received</h3>
          <Pie data={totalSpentVsReceivedData} />
        </div>
      </div>

      {/* Expense List */}
      <ul className="space-y-6">
        {expenses.map((expense) => (
          <li key={expense._id} className="bg-white shadow-md rounded-lg p-6 border">
            <div className="flex justify-between items-center mb-4">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-blue-600">{expense.category}</h3>
                <p className="text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500 flex items-center">
                  ₹{expense.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{expense.description}</p>

            <button
              onClick={() => toggleExpand(expense._id)}
              className="text-blue-500 hover:text-blue-600 flex items-center mb-2"
            >
              <FaUserFriends className="mr-2" />
              {expandedExpense === expense._id ? 'Hide Details' : 'Show Split Details'}
            </button>

            {expandedExpense === expense._id && (
              <ul className="mt-4 space-y-2">
                {expense.splitDetails.length !== 0 ? (
  expense.splitDetails.map((detail, index) => (
    <li
      key={index}
      className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
        detail.hasPaid ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
      }`}
    >
      <div className="flex items-center">
        <span className="font-semibold text-lg text-gray-800 mr-4">{detail.name}</span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700 text-md font-medium">
          ₹{detail.share.toFixed(2)}
        </span>
        <span
          className={`text-sm font-semibold py-1 px-3 rounded-full ${
            detail.hasPaid ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
          }`}
        >
          {detail.hasPaid ? 'Paid' : 'Unpaid'}
        </span>
        <button
          onClick={() => togglePaidStatus(expense._id, index)}
          className="text-2xl hover:scale-110 transform transition duration-200 ease-in-out"
          title={detail.hasPaid ? "Mark as unpaid" : "Mark as paid"}
        >
          {detail.hasPaid ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </button>
      </div>
    </li>
  ))
) : (
  <div className="bg-gray-100 rounded-lg p-4 text-center">
    <h2 className="text-gray-600 text-md font-semibold">No split details available</h2>
    <p className="text-gray-500">This expense is not shared with others.</p>
  </div>
)}

              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
