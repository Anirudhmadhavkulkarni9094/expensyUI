import React, { useEffect, useState } from 'react';
import api from './axiosConfig';
import { Bar, Pie, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const ExpenseAnalysis = () => {
  const [analysis, setAnalysis] = useState({
    totalAmount: 0,
    categoryWise: {},
    dateWise: {},
    monthlyWise: {},
    highestCategory: { category: "", amount: 0 },
    lowestCategory: { category: "", amount: 0 },
    highestDate: { date: "", amount: 0 },
    lowestDate: { date: "", amount: 0 },
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get('https://expensy-rr68.onrender.com/api/expenses/analyze');
        setAnalysis(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAnalysis();
  }, []);

  // Chart Data for Category-Wise Spending
  const categoryData = {
    labels: Object.keys(analysis.categoryWise),
    datasets: [
      {
        label: 'Amount Spent (₹)',
        data: Object.values(analysis.categoryWise),
        backgroundColor: '#4CAF50',
      },
    ],
  };

  // Chart Data for Date-Wise Spending
  const dateData = {
    labels: Object.keys(analysis.dateWise),
    datasets: [
      {
        label: 'Amount Spent (₹)',
        data: Object.values(analysis.dateWise),
        borderColor: '#FF5722',
        backgroundColor: '#FFCCBC',
        fill: true,
      },
    ],
  };

  // Chart Data for Monthly Spending
  const monthlyData = {
    labels: Object.keys(analysis.monthlyWise),
    datasets: [
      {
        label: 'Amount Spent (₹)',
        data: Object.values(analysis.monthlyWise),
        backgroundColor: '#2196F3',
      },
    ],
  };

  // Function to Download Excel File
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Add Total Amount Sheet
    const totalAmountSheet = XLSX.utils.json_to_sheet([{ TotalAmountSpent: analysis.totalAmount }]);
    XLSX.utils.book_append_sheet(workbook, totalAmountSheet, "TotalAmount");

    // Add Category-wise Spending Sheet
    const categorySheet = XLSX.utils.json_to_sheet(
      Object.entries(analysis.categoryWise).map(([category, amount]) => ({ Category: category, AmountSpent: amount }))
    );
    XLSX.utils.book_append_sheet(workbook, categorySheet, "CategoryWise");

    // Add Date-wise Spending Sheet
    const dateSheet = XLSX.utils.json_to_sheet(
      Object.entries(analysis.dateWise).map(([date, amount]) => ({ Date: date, AmountSpent: amount }))
    );
    XLSX.utils.book_append_sheet(workbook, dateSheet, "DateWise");

    // Add Monthly Spending Sheet
    const monthlySheet = XLSX.utils.json_to_sheet(
      Object.entries(analysis.monthlyWise).map(([month, amount]) => ({ Month: month, AmountSpent: amount }))
    );
    XLSX.utils.book_append_sheet(workbook, monthlySheet, "MonthlyWise");

    // Add Highest and Lowest Spending Sheets
    const highLowSheet = XLSX.utils.json_to_sheet([
      { Category: "Highest", Name: analysis.highestCategory.category, Amount: analysis.highestCategory.amount },
       // eslint-disable-next-line 
      { Category: "Lowest", Name: analysis.lowestCategory.category, Amount: analysis.lowestCategory.amount },
       // eslint-disable-next-line 
      { Date: "Highest", Date: analysis.highestDate.date, Amount: analysis.highestDate.amount },
       // eslint-disable-next-line 
      { Date: "Lowest", Date: analysis.lowestDate.date, Amount: analysis.lowestDate.amount },
    ]);
    XLSX.utils.book_append_sheet(workbook, highLowSheet, "HighLowSpending");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, `Expense_Analysis_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-8">Expense Analysis</h2>

      {/* Chart Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Category-wise Spending</h3>
          <Bar data={categoryData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Date-wise Spending</h3>
          <Line data={dateData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Monthly Spending</h3>
          <Pie data={monthlyData} />
        </div>
      </div>

      {/* Spending Summary */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <p className="text-lg font-semibold">Total Amount Spent: ₹{analysis.totalAmount.toFixed(2)}</p>
        <p className="text-lg font-semibold">Highest Category Spending: {analysis.highestCategory.category} - ₹{analysis.highestCategory.amount.toFixed(2)}</p>
        <p className="text-lg font-semibold">Lowest Category Spending: {analysis.lowestCategory.category} - ₹{analysis.lowestCategory.amount.toFixed(2)}</p>
        <p className="text-lg font-semibold">Highest Date Spending: {analysis.highestDate.date} - ₹{analysis.highestDate.amount.toFixed(2)}</p>
        <p className="text-lg font-semibold">Lowest Date Spending: {analysis.lowestDate.date} - ₹{analysis.lowestDate.amount.toFixed(2)}</p>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
        >
          Download Excel Report
        </button>
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
