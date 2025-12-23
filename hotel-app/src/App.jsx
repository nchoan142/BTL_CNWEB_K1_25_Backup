import React from 'react'; // Bỏ useEffect nếu không dùng nữa
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các trang
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminBookings from './pages/AdminBookings';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import History from './pages/History';
import Register from './pages/Register';

function App() {
  // ĐÃ XÓA: useEffect gọi initData() vì không còn cần thiết khi dùng API thật

  return (
    <BrowserRouter>
      {/* ĐÃ XÓA: ForceHomeOnRefresh để user F5 không bị mất trang hiện tại */}
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        
        {/* Các trang Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-bookings" element={<AdminBookings />} />
        
        {/* Các trang Booking & Payment */}
        <Route path="/booking/:roomId" element={<Booking />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;