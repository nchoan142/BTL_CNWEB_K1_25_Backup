// src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { roomService, bookingService } from '../utils/api';

const Booking = () => {
  const { roomId } = useParams(); // Lấy ID phòng từ URL
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  // State lưu thông tin form
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    peopleCount: 1,
    roomCount: 1,
    requests: '' // Không bắt buộc
  });

  // State hiển thị lỗi
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Tìm thông tin phòng đang đặt để hiển thị tên phòng
    const allRooms = roomService.getAll();
    const foundRoom = allRooms.find(r => r.id === parseInt(roomId));
    if (foundRoom) {
      setRoom(foundRoom);
    } else {
      alert("Phòng không tồn tại!");
      navigate('/rooms');
    }
  }, [roomId, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.age || formData.age < 18) newErrors.age = "Phải trên 18 tuổi";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập SĐT";
    if (!formData.email) newErrors.email = "Vui lòng nhập Email";
    if (!formData.peopleCount || formData.peopleCount < 1) newErrors.peopleCount = "Ít nhất 1 người";
    if (!formData.roomCount || formData.roomCount < 1) newErrors.roomCount = "Ít nhất 1 phòng";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // Tìm hàm handleSubmit trong src/pages/Booking.jsx và thay thế bằng đoạn này:

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Gọi API lưu booking (Trạng thái Unpaid)
      const result = bookingService.book({
        roomId: room.id,
        roomName: room.name,
        price: room.price, // Giá gốc
        customer: formData
      });

      if (result.success) {
        // KHÔNG hiện alert ở đây nữa
        // Chuyển hướng sang trang Thanh toán kèm ID booking
        navigate(`/payment/${result.booking.id}`);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!room) return <div>Loading...</div>;

  return (
    <>
      <Header />
      {/* Breadcrumb - Tái sử dụng CSS cũ */}
      <section className="breadcumb-area bg-img d-flex align-items-center justify-content-center" style={{backgroundImage: "url('/img/bg-img/bg-6.jpg')", height: '400px'}}>
        <div className="bradcumbContent">
            <h2>Booking</h2>
        </div>
      </section>

      <section className="contact-form-area mb-100 mt-50">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="section-heading text-center">
                        <div className="line-"></div>
                        <h2>Đặt phòng: {room.name}</h2>
                        <p>Giá: ${room.price} / đêm</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4" style={{background: '#f8f9fa', borderRadius: '5px'}}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Họ và tên <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} name="fullName" onChange={handleChange} />
                                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Tuổi <span className="text-danger">*</span></label>
                                <input type="number" className={`form-control ${errors.age ? 'is-invalid' : ''}`} name="age" onChange={handleChange} />
                                {errors.age && <small className="text-danger">{errors.age}</small>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label>Số điện thoại <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} name="phone" onChange={handleChange} />
                                {errors.phone && <small className="text-danger">{errors.phone}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Email <span className="text-danger">*</span></label>
                                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" onChange={handleChange} />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Số người <span className="text-danger">*</span></label>
                                <input type="number" className={`form-control ${errors.peopleCount ? 'is-invalid' : ''}`} name="peopleCount" value={formData.peopleCount} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Số phòng <span className="text-danger">*</span></label>
                                <input type="number" className={`form-control ${errors.roomCount ? 'is-invalid' : ''}`} name="roomCount" value={formData.roomCount} onChange={handleChange} />
                            </div>

                            <div className="col-12 mb-3">
                                <label>Yêu cầu thêm (Không bắt buộc)</label>
                                <textarea className="form-control" name="requests" rows="3" onChange={handleChange}></textarea>
                            </div>

                            <div className="col-12 text-center">
                                <button type="submit" className="btn palatin-btn">Xác nhận đặt phòng</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Booking;