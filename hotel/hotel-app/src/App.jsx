import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import { initData } from './utils/api';


function App() {
  useEffect(() => {
    initData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking/:roomId" element={<Booking />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;