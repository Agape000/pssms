import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from "../components/MenuBar"

export default function Car() {
  const [formData, setFormData] = useState({
    PlateNumber: '',
    DriverName: '',
    PhoneNumber: '',
  });
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:3000/car');
      setCars(res.data);
    } catch (err) {
      setError('Failed to fetch cars');
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post('http://localhost:3000/car', formData);
      setMessage(res.data.message);
      setFormData({ PlateNumber: '', DriverName: '', PhoneNumber: '' });
      fetchCars();
    } catch (err) {
      setError('Failed to add car');
    }
  };

  return (
    <>
    <MenuBar/>
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Car Management</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {message && <div className="text-green-600 mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="PlateNumber"
          placeholder="Plate Number"
          value={formData.PlateNumber}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="DriverName"
          placeholder="Driver Name"
          value={formData.DriverName}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="PhoneNumber"
          placeholder="Phone Number"
          value={formData.PhoneNumber}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Car
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Car List</h3>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Plate Number</th>
            <th className="border p-2">Driver Name</th>
            <th className="border p-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={index}>
              <td className="border p-2">{car.PlateNumber}</td>
              <td className="border p-2">{car.DriverName}</td>
              <td className="border p-2">{car.PhoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
