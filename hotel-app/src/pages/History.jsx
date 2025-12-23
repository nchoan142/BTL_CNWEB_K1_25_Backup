// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import { authService, bookingService } from '../utils/api';
import { toast } from 'react-toastify';

const History = () => {
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          toast.warning("Vui lòng đăng nhập để xem lịch sử!");
          navigate('/login');
          return;
        }
        setUser(currentUser);

        // 1. Dùng currentUser.id thay vì username (vì backend cần ID)
        const data = await bookingService.getHistory(currentUser.id);
        
        // 2. Kiểm tra nếu data là mảng thì mới set state
        if (Array.isArray(data)) {
            // Sắp xếp ID lớn nhất (mới nhất) lên đầu
            const sorted = data.sort((a, b) => b.id - a.id);
            setMyBookings(sorted);
        }
    };

    fetchHistory();
  }, [navigate]);

  // Hàm format ngày tháng cho đẹp (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="badge badge-success">Đã thanh toán</span>;
      case 'Pay at Hotel': return <span className="badge badge-warning">Thanh toán tại KS</span>;
      case 'Pending': return <span className="badge badge-secondary">Đang chờ duyệt</span>;
      case 'Cancelled': return <span className="badge badge-danger">Đã hủy</span>;
      default: return <span className="badge badge-info">{status}</span>;
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <section 
        className="breadcumb-area bg-img d-flex align-items-center justify-content-center" 
        style={{ backgroundImage: "url('/img/bg-img/bg-6.jpg')", height: '300px' }}
      >
        <div className="bradcumbContent">
            <h2>Hồ sơ & Lịch sử</h2>
        </div>
      </section>

      <div className="container" style={{ marginTop: '50px', marginBottom: '100px' }}>
        
        {/* --- User Info --- */}
        <div className="row mb-50">
            <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center">
                         {/* Ảnh đại diện mặc định */}
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                            alt="User Avatar" 
                            style={{width: '80px', marginBottom: '10px'}}
                        />
                        <h4 style={{color: '#cb8670', fontSize: '20px'}}>{user.username}</h4>
                        <p className="text-muted"><small>Thành viên thân thiết</small></p>
                        <hr/>
                        <div className="text-center">
                            <h2 style={{color: '#FFD700', fontWeight: 'bold', fontSize: '50px'}}>
                                {myBookings.length}
                            </h2>
                            <small style={{fontWeight: 'bold', textTransform: 'uppercase'}}>Lần đặt phòng</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-12 col-md-8">
                <div className="card shadow-sm h-100" style={{border: '1px solid #eee'}}>
                    <div className="card-header bg-white">
                        <h5 className="mb-0">Thông tin tài khoản</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Tên đăng nhập:</small>
                                <p className="font-weight-bold">{user.username}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">Vai trò:</small>
                                <p>{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <small className="text-muted">ID thành viên:</small>
                                <p>#{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Table History --- */}
        <div className="row">
            <div className="col-12">
                <h3 className="mb-4" style={{fontFamily: 'Lobster, cursive', color: '#cb8670'}}>
                    Lịch sử đặt phòng của bạn
                </h3>
                
                {myBookings.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover shadow-sm">
                            <thead className="thead-light">
                                <tr>
                                    <th>Mã Đơn</th>
                                    <th>Thời gian</th>
                                    <th>Phòng & Giá</th>
                                    <th>Thông tin người ở</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBookings.map(item => (
                                    <tr key={item.id}>
                                        <td className="align-middle"><strong>#{item.id}</strong></td>
                                        
                                        {/* Sửa: Dùng đúng key từ database trả về (check_in_date) */}
                                        <td className="align-middle" style={{minWidth: '160px'}}>
                                            <small>Check-in:</small> <strong>{formatDate(item.check_in_date)}</strong><br/>
                                            <small>Check-out:</small> <strong>{formatDate(item.check_out_date)}</strong>
                                        </td>

                                        <td className="align-middle">
                                            {/* Backend trả về cột 'type' (loại phòng) và 'room_number' */}
                                            <span style={{fontWeight: 'bold', color: '#cb8670', fontSize: '16px'}}>
                                                Phòng {item.room_number} ({item.type})
                                            </span>
                                            <br/>
                                            <small>{item.room_count} phòng - {item.people_count} người</small>
                                            <br/>
                                            <strong className="text-success">${item.total_price}</strong>
                                        </td>

                                        {/* Sửa: Dùng guest_name, guest_phone thay vì customer.fullName */}
                                        <td className="align-middle">
                                            <strong>{item.guest_name}</strong><br/>
                                            <small>{item.guest_phone}</small><br/>
                                            <small className="text-muted">{item.guest_email}</small>
                                        </td>

                                        <td className="align-middle">{getStatusBadge(item.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center p-5 border rounded bg-white">
                        <p className="mb-3">Bạn chưa có đơn đặt phòng nào.</p>
                        <Link to="/rooms" className="btn palatin-btn">Đặt phòng ngay</Link>
                    </div>
                )}
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default History;