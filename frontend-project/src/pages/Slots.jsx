import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [slotNumber, setSlotNumber] = useState('');
  const [slotStatus, setSlotStatus] = useState('available');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/slots'); 
      if (!res.ok) throw new Error('Failed to fetch slots');
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!slotNumber) {
      setError('Slot Number is required');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SlotNumber: slotNumber, SlotStatus: slotStatus }),
      });
      if (!res.ok) throw new Error('Failed to add slot');
      setSlotNumber('');
      setSlotStatus('available');
      fetchSlots(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <MenuBar />
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Parking Slots</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
        {error && <div className="text-red-600">{error}</div>}

        <div>
          <label className="block mb-1 font-semibold">Slot Number</label>
          <input
            type="text"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter slot number"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Slot Status</label>
          <select
            value={slotStatus}
            onChange={(e) => setSlotStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Slot'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Current Slots</h2>
      {loading && <p>Loading slots...</p>}
      {!loading && slots.length === 0 && <p>No slots found.</p>}

      {slots.length > 0 && (
        <table className="w-full border border-gray-300 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Slot Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Slot Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.SlotNumber} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{slot.SlotNumber}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{slot.SlotStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
}
