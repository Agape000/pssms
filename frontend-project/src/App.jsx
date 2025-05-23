import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login';
import Home from './pages/Home';
import Car from './pages/car';
import Record from './pages/Record';
import ParkingSlots from './pages/Slots';

export default function App() {
  return (
    <Router>
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/car" element={<Car/>} />
            <Route path="/slot" element={<ParkingSlots/>} />
            <Route path="/record" element={<Record/>} />

          </Routes>
        </main>
    </Router>
  );
}
