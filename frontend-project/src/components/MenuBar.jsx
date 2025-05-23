import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
export default function MenuBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Logged out!');
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `font-semibold px-3 py-2 rounded hover:bg-blue-700 transition ${
      isActive ? 'bg-blue-800 underline' : ''
    }`;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-center space-x-6">
         <NavLink to="/home" className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/car" className={linkClass}>
        Car ParkingSpot
      </NavLink>
      <NavLink to="/slot" className={linkClass}>
        Slots
      </NavLink>
      <NavLink to="/record" className={linkClass}>
        Parking Record
      </NavLink>
      <NavLink to="/payment" className={linkClass}>
        Payment
      </NavLink>
      <NavLink to="/reports" className={linkClass}>
        Reports
      </NavLink>
      <button
        onClick={handleLogout}
        className="font-semibold px-3 py-2 rounded hover:bg-blue-700 transition"
      >
        Logout
      </button>
    </nav>
  );
}
