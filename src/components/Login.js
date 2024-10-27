import React, { useState } from 'react';
import api from './axiosConfig'; // Import the configured Axios instance
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login and Register views
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegistering) {
      // Registration Logic
      try {
        const response = await api.post('https://expensy-rr68.onrender.com/api/auth/register', formData);
        setSuccess('User registered successfully');
        setFormData({ username: '', email: '', password: '' });
        setTimeout(() => setIsRegistering(false), 2000); // Switch to login view after success
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError(error.response.data.error); // Show specific error if user exists
        } else {
          setError('Error registering user');
        }
      }
    } else {
      // Login Logic
      try {
        const response = await api.post('https://expensy-rr68.onrender.com/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        const token = response.data.token;

        // Save token to localStorage and navigate to the main page
        localStorage.setItem('token', token);
        navigate('/expenses');
      } catch (error) {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold text-center text-blue-600">{isRegistering ? 'Register' : 'Login'}</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {isRegistering && (
          <div>
            <label className="block text-gray-700 font-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p className="text-center text-gray-600">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"} 
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setFormData({ username: '', email: '', password: '' }); // Reset form
              setError('');
              setSuccess('');
            }}
            className="text-blue-500 hover:underline ml-1"
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
