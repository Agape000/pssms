import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
import axios from 'axios';
export default function ParkingRecords() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [form, setForm] = useState({
    EntryTime: '',
    ExitTime: '',
    Duration: '',
    PlateNumber: '',
    SlotNumber: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Helper function to parse datetime-local value to ISO string
  const parseInputToISO = (datetimeLocal) => {
    if (!datetimeLocal) return '';
    return new Date(datetimeLocal).toISOString();
  };

  // Fetch cars from backend
  const fetchCars = async () => {
    try {
      console.log('Fetching cars from:', 'http://localhost:3000/car');
      const res = await axios.get('http://localhost:3000/car');
      console.log('Cars response:', res.data);
      setCars(res.data);
    } catch (err) {
      console.error('Error fetching cars:', err.response?.data || err.message);
      console.error('Full error:', err);
      // Don't set error state, just log it so dropdowns still work
    }
  };

  // Fetch parking slots from backend
  const fetchParkingSlots = async () => {
    try {
      console.log('Fetching slots from:', 'http://localhost:3000/slots');
      const res = await axios.get('http://localhost:3000/slots');
      console.log('Slots response:', res.data);
      setParkingSlots(res.data);
    } catch (err) {
      console.error('Error fetching parking slots:', err.response?.data || err.message);
      console.error('Full error:', err);
      // Don't set error state, just log it so dropdowns still work
    }
  };

  // Fetch records from backend
  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/records');
      if (!res.ok) throw new Error('Failed to fetch records');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchCars();
    fetchParkingSlots();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for datetime fields
    if (name === 'EntryTime' || name === 'ExitTime') {
      setForm(prev => ({
        ...prev,
        [name]: parseInputToISO(value)
      }));
      
      // Calculate duration if both times are present
      if (name === 'EntryTime' && form.ExitTime) {
        calculateDuration(value, form.ExitTime);
      } else if (name === 'ExitTime' && form.EntryTime) {
        calculateDuration(form.EntryTime, value);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Calculate duration in minutes
  const calculateDuration = (entryTime, exitTime) => {
    if (!entryTime || !exitTime) return;
    
    const entryDate = new Date(entryTime);
    const exitDate = new Date(exitTime);
    
    if (exitDate > entryDate) {
      const diffMs = exitDate - entryDate;
      const durationMins = Math.floor(diffMs / 60000);
      setForm(prev => ({ ...prev, Duration: durationMins }));
    }
  };

  // Reset form state
  const resetForm = () => {
    setForm({
      EntryTime: '',
      ExitTime: '',
      Duration: '',
      PlateNumber: '',
      SlotNumber: ''
    });
    setEditingId(null);
    setError(null);
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.EntryTime || !form.ExitTime || !form.Duration || !form.PlateNumber || !form.SlotNumber) {
      setError('All fields are required');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `http://localhost:3000/records/${editingId}` : 'http://localhost:3000/records';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      resetForm();
      fetchRecords();

    } catch (err) {
      setError(err.message);
    }
  };

  // Edit record
  const handleEdit = (record) => {
    setForm({
      EntryTime: record.EntryTime,
      ExitTime: record.ExitTime,
      Duration: record.Duration,
      PlateNumber: record.PlateNumber,
      SlotNumber: record.SlotNumber
    });
    setEditingId(record.RecordID);
    setError(null);
  };

  // Delete record
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`http://localhost:3000/records/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <MenuBar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Parking Records</h1>

        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow space-y-4">
          {error && <p className="text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Entry Time</label>
              <input
                type="datetime-local"
                name="EntryTime"
                value={formatDateForInput(form.EntryTime)}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Exit Time</label>
              <input
                type="datetime-local"
                name="ExitTime"
                value={formatDateForInput(form.ExitTime)}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="Duration"
                value={form.Duration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Plate Number</label>
              <select
                name="PlateNumber"
                value={form.PlateNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a car...</option>
                {cars.map((car) => (
                  <option key={car.PlateNumber} value={car.PlateNumber}>
                    {car.PlateNumber} - {car.Model} ({car.Color})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Slot Number</label>
              <select
                name="SlotNumber"
                value={form.SlotNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a parking slot...</option>
                {parkingSlots.map((slot) => (
                  <option key={slot.SlotNumber} value={slot.SlotNumber}>
                    Slot {slot.SlotNumber} - {slot.Location} ({slot.Size})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2 className="text-2xl font-semibold mb-4">All Records</h2>

        {loading && <p>Loading records...</p>}
        {!loading && records.length === 0 && <p>No parking records found.</p>}

        {records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Record ID</th>
                  <th className="border border-gray-300 px-4 py-2">Entry Time</th>
                  <th className="border border-gray-300 px-4 py-2">Exit Time</th>
                  <th className="border border-gray-300 px-4 py-2">Duration</th>
                  <th className="border border-gray-300 px-4 py-2">Plate Number</th>
                  <th className="border border-gray-300 px-4 py-2">Slot Number</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.RecordID} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{record.RecordID}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(record.EntryTime).toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(record.ExitTime).toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.Duration}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.PlateNumber}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.SlotNumber}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.RecordID)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}