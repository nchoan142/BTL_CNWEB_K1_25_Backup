// src/pages/AdminBookings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { bookingService, authService } from '../utils/api';
import { toast } from 'react-toastify';

// Component xác nhận xóa
const ConfirmDeleteMsg = ({ closeToast, onConfirm }) => (
  <div>
    <h6 style={{marginBottom: '10px'}}>Bạn chắc chắn muốn xóa đơn này?</h6>
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <button className="btn btn-secondary btn-sm mr-2" onClick={closeToast}>Hủy</button>
      <button 
        className="btn btn-danger btn-sm" 
        onClick={() => { onConfirm(); closeToast(); }}
      >
        Xóa ngay
      </button>
    </div>
  </div>
);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // 1. TỐI ƯU: Hàm tải dữ liệu có kiểm tra mảng
  const loadData = async () => {
      try {
          const data = await bookingService.getAll();
          if (Array.isArray(data)) {
              setBookings(data);
          } else {
              setBookings([]);
          }
      } catch (error) {
          console.error(error);
          setBookings([]);
      }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      toast.error("Bạn không có quyền truy cập trang này!");
      navigate('/login');
      return;
    }
    loadData(); 
  }, [navigate]);

  const handleDelete = (id) => {
    const performDelete = async () => {
        const result = await bookingService.delete(id);
        if (result.success) {
            toast.success(`Đã xóa đơn #${id} thành công!`);
            loadData(); 
        } else {
            toast.error("Lỗi xóa đơn hàng: " + (result.message || "Không rõ"));
        }
    };

    toast.warn(<ConfirmDeleteMsg onConfirm={performDelete} />, {
        position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false
    });
  };

  // --- TÍNH NĂNG MỚI: DUYỆT ĐƠN ---
  const handleApprove = async (id) => {
      // Gọi API update trạng thái thành Paid
      const result = await bookingService.updateStatus(id, 'Paid', 'Cash/Transfer');
      if (result.success) {
          toast.success(`Đơn #${id} đã được xác nhận thanh toán!`);
          loadData();
      } else {
          toast.error("Lỗi cập nhật: " + result.message);
      }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="badge badge-success">Đã thanh toán</span>;
      case 'Pay at Hotel': return <span className="badge badge-warning">Thanh toán tại KS</span>;
      case 'Pending': return <span className="badge badge-info">Chờ duyệt</span>; // Thêm trạng thái này
      case 'Cancelled': return <span className="badge badge-secondary">Đã hủy</span>;
      default: return <span className="badge badge-danger">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
      if(!dateString) return "";
      return new Date(dateString).toLocaleDateString('vi-VN');
  }

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '150px', marginBottom: '100px' }}>
        <h2 className="mb-4 text-center text-lobster" style={{color: '#626ad4ff', fontSize: '50px' }}>
            Quản lý Đặt Phòng
        </h2>
        <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
            <thead style={{ backgroundColor: '#f8f9fa', color: '#333' }}>
                <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Thời Gian</th>
                <th>Liên Hệ</th>
                <th>Chi Tiết</th>
                <th>Thanh Toán</th>
                <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {bookings.length > 0 ? bookings.map(b => (
                <tr key={b.id}>
                    <td className="align-middle text-center"><strong>#{b.id}</strong></td>
                    
                    <td className="align-middle">
                        <strong>{b.guest_name}</strong><br/>
                        <small className="text-muted">ID User: {b.users_id}</small>
                    </td>

                    <td className="align-middle" style={{minWidth: '140px'}}>
                        <small className="text-muted">In: </small><strong>{formatDate(b.check_in_date)}</strong><br/>
                        <small className="text-muted">Out: </small><strong>{formatDate(b.check_out_date)}</strong>
                    </td>

                    <td className="align-middle">
                        {b.guest_phone}<br/>
                        <small>{b.guest_email}</small>
                    </td>

                    <td className="align-middle">
                        Loại: <strong>{b.room_type}</strong><br/>
                        <span className="badge badge-light border">Phòng: {b.room_number}</span><br/>
                        <small>{b.people_count} Khách - {b.room_count} Phòng</small>
                        {b.guest_requests && <div className="text-info small mt-1">Note: {b.guest_requests}</div>}
                    </td>

                    <td className="align-middle">
                        {getStatusBadge(b.status)}<br/>
                        <strong className="text-success">${b.total_price}</strong>
                    </td>

                    <td className="align-middle text-center">
                        {/* Nút Duyệt chỉ hiện khi chưa thanh toán */}
                        {b.status !== 'Paid' && b.status !== 'Cancelled' && (
                            <button 
                                className="btn btn-success btn-sm mb-1 mr-1" 
                                title="Xác nhận đã thanh toán"
                                onClick={() => handleApprove(b.id)}
                            >
                                <i className="fa fa-check"></i> Duyệt
                            </button>
                        )}
                        
                        <button className="btn btn-danger btn-sm mb-1" onClick={() => handleDelete(b.id)}>
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