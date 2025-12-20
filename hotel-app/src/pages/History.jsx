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
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để xem lịch sử!");
      navigate('/login');
      return;
    }
    setUser(currentUser);
    const history = bookingService.getHistory(currentUser.username);
    const sortedHistory = history.sort((a, b) => b.id - a.id);
    setMyBookings(sortedHistory);
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

      {/* Banner nhỏ phía trên */}
      <section 
        className="breadcumb-area bg-img d-flex align-items-center justify-content-center" 
        style={{
            backgroundImage: "url('/img/bg-img/bg-6.jpg')",
            height: '300px'
        }}
      >
        <div className="bradcumbContent">
            <h2>Hồ sơ & Lịch sử</h2>
        </div>
      </section>

      <div className="container" style={{ marginTop: '50px', marginBottom: '100px' }}>
        
        {/* --- PHẦN THÔNG TIN TÀI KHOẢN --- */}
        <div className="row mb-50">
            <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                            alt="User Avatar" 
                            style={{width: '80px', marginBottom: '10px'}}
                        />
                        <h4 style={{color: 'var(--accent-pink)', fontSize: '20px'}}>{user.username}</h4>
                        <p className="text-muted"><small>Thành viên thân thiết</small></p>
                        <hr/>
                        
                        {/* ĐÃ XÓA PHẦN ĐIỂM THƯỞNG, CHỈ GIỮ LẠI SỐ LẦN ĐẶT */}
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
                <div className="card shadow-sm h-100" style={{border: '1px solid var(--border-color)'}}>
                    <div className="card-header bg-white">
                        <h5 className="mb-0">Thông tin tài khoản hệ thống</h5>
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
                                <small className="text-muted">Trạng thái:</small><br/>
                                <span className="badge badge-success">Đang hoạt động</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- BẢNG LỊCH SỬ --- */}
        <div className="row">
            <div className="col-12">
                <h3 className="mb-4" style={{fontFamily: 'Lobster, cursive', color: '#596be3ff'}}>
                    Lịch sử đặt phòng của bạn
                </h3>
                
                {myBookings.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover shadow-sm">
                            <thead style={{backgroundColor: 'var(--primary-color)'}}>
                                <tr>
                                    <th>Mã Đơn</th>
                                    <th>Thời gian lưu trú</th>
                                    <th>Phòng & Giá</th>
                                    <th>Khách hàng (Người ở)</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBookings.map(item => (
                                    <tr key={item.id}>
                                        <td className="align-middle"><strong>#{item.id}</strong></td>
                                        
                                        <td className="align-middle" style={{minWidth: '160px'}}>
                                            <small className="text-muted">Ngày đặt: {item.date}</small>
                                            <hr style={{margin: '5px 0'}}/>
                                            <small>Check-in:</small> <strong>{item.customer.checkIn}</strong><br/>
                                            <small>Check-out:</small> <strong>{item.customer.checkOut}</strong>
                                        </td>

                                        <td className="align-middle">
                                            <span style={{fontWeight: 'bold', color: 'var(--accent-pink)', fontSize: '16px'}}>
                                                {item.roomName}
                                            </span>
                                            <br/>
                                            <small>{item.customer.roomCount} phòng - {item.customer.peopleCount} người</small>
                                            <br/>
                                            {item.finalPrice ? (
                                                <strong className="text-success">${item.finalPrice}</strong>
                                            ) : (
                                                <span>Đang chờ...</span>
                                            )}
                                        </td>

                                        <td className="align-middle">
                                            <strong>{item.customer.fullName}</strong><br/>
                                            <small>{item.customer.phone}</small><br/>
                                            <small className="text-muted">{item.customer.email}</small>
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