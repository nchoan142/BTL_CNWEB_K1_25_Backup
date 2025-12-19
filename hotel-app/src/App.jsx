import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các trang
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminBookings from './pages/AdminBookings';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import { initData } from './utils/api';
import History from './pages/History';

// --- 1. TẠO COMPONENT PHỤ ĐỂ XỬ LÝ REDIRECT ---
const ForceHomeOnRefresh = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Nếu đường dẫn hiện tại KHÔNG phải là trang chủ ('/')
    if (location.pathname !== '/') {
      // Chuyển hướng ngay lập tức về trang chủ
      navigate('/', { replace: true });
    }
  }, []); // [] rỗng đảm bảo chỉ chạy 1 lần duy nhất khi App vừa load (F5)

  return null; // Component này không vẽ gì ra màn hình cả
};
// ----------------------------------------------

function App() {
  useEffect(() => {
    initData(); // Reset dữ liệu (như bài trước)
  }, []);

  return (
    <BrowserRouter>
      {/* --- 2. ĐẶT COMPONENT VÀO TRONG BROWSER ROUTER --- */}
      <ForceHomeOnRefresh />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-bookings" element={<AdminBookings />} />
        <Route path="/booking/:roomId" element={<Booking />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;