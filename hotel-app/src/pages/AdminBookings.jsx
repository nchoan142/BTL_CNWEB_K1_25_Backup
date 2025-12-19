// src/pages/AdminBookings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { bookingService, authService } from '../utils/api';
// 1. Import Toast
import { toast } from 'react-toastify';

// 2. Component xác nhận xóa (Giống bên Admin)
const ConfirmDeleteMsg = ({ closeToast, onConfirm }) => (
  <div>
    <h6 style={{marginBottom: '10px'}}>Bạn chắc chắn muốn xóa đơn này?</h6>
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <button 
        className="btn btn-secondary btn-sm mr-2" 
        onClick={closeToast}
      >
        Hủy
      </button>
      <button 
        className="btn btn-danger btn-sm" 
        onClick={() => {
          onConfirm(); 
          closeToast();
        }}
      >
        Xóa ngay
      </button>
    </div>
  </div>
);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Kiểm tra quyền Admin
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      // Thay alert bằng toast lỗi
      toast.error("Bạn không có quyền truy cập trang này!");
      navigate('/login');
      return;
    }
    // 2. Lấy dữ liệu booking
    setBookings(bookingService.getAll());
  }, [navigate]);

  // Hàm xóa đơn đặt phòng (Đã nâng cấp dùng Toast Confirm)
  const handleDelete = (id) => {
    // Định nghĩa hành động xóa
    const performDelete = () => {
        const updatedList = bookingService.delete(id);
        setBookings(updatedList);
        toast.success(`Đã xóa đơn #${id} thành công!`);
    };

    // Hiện Toast xác nhận (không tự tắt)
    toast.warn(
        <ConfirmDeleteMsg onConfirm={performDelete} />, 
        {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false
        }
    );
  };

  // Hàm hiển thị màu sắc cho trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="badge badge-success">Đã thanh toán</span>;
      case 'Pay at Hotel': return <span className="badge badge-warning">Thanh toán tại KS</span>;
      default: return <span className="badge badge-danger">Chưa thanh toán</span>;
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '150px', marginBottom: '100px' }}>
        <h2 className="mb-4 text-center">Quản lý Đặt Phòng</h2>
        <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
            <thead style={{ backgroundColor: 'var(--border-color)', color: '#333' }}>
                <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Liên Hệ</th>
                <th>Chi Tiết</th>
                <th>Yêu Cầu</th>
                <th>Thanh Toán</th>
                <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {bookings.length > 0 ? bookings.map(b => (
                <tr key={b.id}>
                    <td className="align-middle"><strong>#{b.id}</strong><br/><small>{b.date}</small></td>
                    
                    {/* Thông tin khách hàng */}
                    <td className="align-middle">
                        <strong>{b.customer.fullName}</strong><br/>
                        <small>Tuổi: {b.customer.age}</small>
                    </td>

                    {/* Email & SĐT */}
                    <td className="align-middle">
                        {b.customer.phone}<br/>
                        <small>{b.customer.email}</small>
                    </td>

                    {/* Số người/phòng */}
                    <td className="align-middle">
                        Phòng: <strong>{b.roomName}</strong><br/>
                        <span className="badge badge-light border">
                            {b.customer.peopleCount} Người - {b.customer.roomCount} Phòng
                        </span>
                    </td>

                    {/* Yêu cầu thêm */}
                    <td className="align-middle">
                        <small className="text-muted">
                            {b.customer.requests || "Không có"}
                        </small>
                    </td>

                    {/* Trạng thái thanh toán */}
                    <td className="align-middle">
                        {getStatusBadge(b.status)}<br/>
                        {b.paymentMethod && <small>Qua: {b.paymentMethod}</small>}<br/>
                        {b.finalPrice && <strong className="text-success">${b.finalPrice}</strong>}
                    </td>

                    <td className="align-middle">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                             <i className="fa fa-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan="7" className="text-center py-4">Chưa có đơn đặt phòng nào.</td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default AdminBookings;