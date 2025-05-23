import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ Username: '', Password: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // 👈 here

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post('http://localhost:3000/auth/login', formData);
      setMessage(res.data.message);
      console.log('Logged in user:', res.data.user);

      // 👇 navigate to /home after login success
      navigate('/home');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Something went wrong');
      } else {
        setError('Network error');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="Username">Username</label>
          <input
            type="text"
            id="Username"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="Password">Password</label>
          <input
            type="password"
            id="Password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
