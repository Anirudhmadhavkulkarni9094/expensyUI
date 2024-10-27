import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import ExpenseAnalysis from './components/ExpenseAnalysis';
import ReportDownload from './components/ReportDownload';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><ExpenseAnalysis /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportDownload /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
