import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <Link to="/" className="text-white text-2xl font-bold">
          Expensy
        </Link>

        {/* Navbar Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-blue-200 transition duration-200">
            Home
          </Link>
          <Link to="/add" className="text-white hover:text-blue-200 transition duration-200">
            Add Expense
          </Link>
          <Link to="/expenses" className="text-white hover:text-blue-200 transition duration-200">
            Expense List
          </Link>
          <Link to="/report" className="text-white hover:text-blue-200 transition duration-200">
            Reports
          </Link>
          <Link to="/analysis" className="text-white hover:text-blue-200 transition duration-200">
            Analysis
          </Link>
          <button onClick={()=>{
            localStorage.clear() 
            window.location.reload()
        }} className='text-white hover:text-blue-200 transition duration-200'>Logout</button>

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-white focus:outline-none"
            onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden mt-4 bg-blue-700 p-2 rounded-lg">
        <Link to="/" className="block text-white py-2 px-4 hover:bg-blue-500 rounded" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>
          Home
        </Link>
        <Link to="/add-expense" className="block text-white py-2 px-4 hover:bg-blue-500 rounded" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>
          Add Expense
        </Link>
        <Link to="/expenses" className="block text-white py-2 px-4 hover:bg-blue-500 rounded" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>
          Expense List
        </Link>
        <Link to="/report" className="block text-white py-2 px-4 hover:bg-blue-500 rounded" onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>
          Reports
        </Link>
        <Link to="/analysis" className="block text-white py-2 px-4 hover:bg-blue-500 rounded"  onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}>
            Analysis
          </Link>
          <button onClick={()=>{
                localStorage.clear()
                window.location.reload()
            }} className='block text-white py-2 px-4 hover:bg-blue-500 rounded'>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
