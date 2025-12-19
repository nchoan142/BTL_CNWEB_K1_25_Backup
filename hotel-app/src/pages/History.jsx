// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { authService, bookingService } from '../utils/api';
import { toast } from 'react-toastify';

const History = () => {
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để xem lịch sử!");
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // 2. Lấy danh sách đơn hàng của user này
    const history = bookingService.getHistory(currentUser.username);
    setMyBookings(history);
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="badge badge-success">Đã thanh toán</span>;
      case 'Pay at Hotel': return <span className="badge badge-warning">Thanh toán tại KS</span>;
      default: return <span className="badge badge-danger">Chưa thanh toán</span>;
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '150px', marginBottom: '100px' }}>
        
        {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN --- */}
        <div className="row mb-50">
            <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0" style={{backgroundColor: '#fff0f7'}}>
                    <div className="card-body text-center">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                            alt="User Avatar" 
                            style={{width: '100px', marginBottom: '15px'}}
                        />
                        <h4 style={{color: 'var(--accent-pink)'}}>{user.username}</h4>
                        <p className="text-muted">Thành viên thân thiết</p>
                        <hr/>
                        <h1 style={{fontSize: '60px', color: '#FFD700', fontWeight: 'bold'}}>
                            {myBookings.length}
                        </h1>
                        <span>Lần đặt phòng</span>
                    </div>
                </div>
            </div>
            
            <div className="col-12 col-md-8">
                <div className="card shadow-sm h-100" style={{border: '2px solid var(--border-color)'}}>
                    <div className="card-header bg-white">
                        <h4 className="mb-0">Thông tin tài khoản</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Tên đăng nhập:</label>
                                <p>{user.username}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Vai trò:</label>
                                <p>{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Ngày tham gia:</label>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Trạng thái:</label>
                                <span className="text-success">● Đang hoạt động</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- PHẦN 2: BẢNG LỊCH SỬ ĐẶT PHÒNG --- */}
        <div className="row">
            <div className="col-12">
                <h3 className="mb-4" style={{fontFamily: 'Lobster, cursive'}}>Lịch sử đặt phòng của bạn</h3>
                
                {myBookings.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover shadow-sm">
                            <thead style={{backgroundColor: 'var(--primary-color)'}}>
                                <tr>
                                    <th>Mã Đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Phòng</th>
                                    <th>Thông tin liên hệ</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBookings.map(item => (
                                    <tr key={item.id}>
                                        <td><strong>#{item.id}</strong></td>
                                        <td>{item.date}</td>
                                        <td>
                                            <span style={{fontWeight: 'bold', color: 'var(--accent-pink)'}}>
                                                {item.roomName}
                                            </span>
                                            <br/>
                                            <small>{item.customer.roomCount} phòng - {item.customer.peopleCount} người</small>
                                        </td>
                                        <td>
                                            {item.customer.fullName}<br/>
                                            <small>{item.customer.phone}</small>
                                        </td>
                                        <td>
                                            {item.finalPrice ? (
                                                <strong className="text-success">${item.finalPrice}</strong>
                                            ) : (
                                                <span>Đang chờ...</span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(item.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center p-5 border rounded" style={{backgroundColor: '#f9f9f9'}}>
                        <p className="mb-3">Bạn chưa có đơn đặt phòng nào.</p>
                        <Link to="/rooms" className="btn palatin-btn">Đặt phòng ngay</Link>
                    </div>
                )}
            </div>
        </div>

      </div>
    </>
  );
};

export default History;