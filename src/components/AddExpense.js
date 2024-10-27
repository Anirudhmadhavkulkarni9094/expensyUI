import React, { useState } from 'react';
import api from './axiosConfig';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
    splitWith: '',
  });

  // List of predefined categories
  const categories = [
    'Food',
    'Travel',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Rent',
    'Health',
    'Others'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create an array from the comma-separated splitWith string, trimming each name
    const splitArray = formData.splitWith
      ? formData.splitWith.split(',').map((name) => ({ name: name.trim() }))
      : [];
  
    // Prepare data, excluding splitWith if splitArray is empty
    const expenseData = {
      ...formData,
      date :  Date.now(),
      ...(splitArray.length > 0 && { splitWith: splitArray }), 
      // Include splitWith only if it's non-empty
    };
  
    try {
      await api.post('https://expensy-rr68.onrender.com/api/expenses/add', expenseData);
      alert('Expense added successfully!');
      window.location.href = "/expenses";
    } catch (error) {
      alert('Failed to add expense');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl mb-6 text-center font-semibold">Add Expense</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
        <input
          name="amount"
          type="number"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
        <select
          name="category"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <input
          name="description"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Split With (comma-separated)</label>
        <input
          name="splitWith"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
        />
      </div>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" type="submit">
        Add Expense
      </button>
    </form>
  );
};

export default AddExpense;
