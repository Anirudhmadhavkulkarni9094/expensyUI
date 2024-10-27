import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaListAlt, FaChartPie, FaFileDownload } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-10">Expense Tracker Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl">
        
        <Link to="/add" className="p-6 bg-white rounded-lg shadow-lg hover:bg-blue-100 transition duration-200">
          <div className="flex flex-col items-center text-blue-600">
            <FaPlusCircle className="text-4xl mb-2" />
            <h2 className="text-xl font-semibold">Add Expense</h2>
            <p className="text-sm text-gray-600">Create a new expense entry and split it with others.</p>
          </div>
        </Link>

        <Link to="/expenses" className="p-6 bg-white rounded-lg shadow-lg hover:bg-blue-100 transition duration-200">
          <div className="flex flex-col items-center text-blue-600">
            <FaListAlt className="text-4xl mb-2" />
            <h2 className="text-xl font-semibold">View Expenses</h2>
            <p className="text-sm text-gray-600">See a list of all your expenses and split details.</p>
          </div>
        </Link>

        <Link to="/analysis" className="p-6 bg-white rounded-lg shadow-lg hover:bg-blue-100 transition duration-200">
          <div className="flex flex-col items-center text-blue-600">
            <FaChartPie className="text-4xl mb-2" />
            <h2 className="text-xl font-semibold">Expense Analysis</h2>
            <p className="text-sm text-gray-600">Analyze your spending patterns and unpaid balances.</p>
          </div>
        </Link>

        <Link to="/report" className="p-6 bg-white rounded-lg shadow-lg hover:bg-blue-100 transition duration-200">
          <div className="flex flex-col items-center text-blue-600">
            <FaFileDownload className="text-4xl mb-2" />
            <h2 className="text-xl font-semibold">Download Report</h2>
            <p className="text-sm text-gray-600">Generate and download a CSV report of your expenses.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
