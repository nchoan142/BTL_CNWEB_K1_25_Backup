// src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { roomService, bookingService, authService } from '../utils/api';
import { toast } from 'react-toastify';

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
      fullName: '', 
      age: '', 
      phone: '', 
      email: '',
      peopleCount: 1, 
      roomCount: 1, 
      checkIn: '', 
      checkOut: '', 
      requests: ''
  });

  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // 1. TỐI ƯU: Chỉ dùng 1 useEffect để load dữ liệu phòng theo ID
  useEffect(() => {
     const fetchRoom = async () => {
         try {
             const data = await roomService.getById(roomId);
             if (data) {
                 setRoom(data);
                 // Mặc định giá ban đầu là giá 1 đêm
                 setTotalPrice(data.price);
             } else {
                 toast.error("Phòng không tồn tại!");
                 navigate('/rooms');
             }
         } catch (error) {
             console.error(error);
             toast.error("Lỗi khi tải thông tin phòng");
         }
     };
     fetchRoom();
  }, [roomId, navigate]);

  // 2. Logic tính tiền: Đã ổn, chỉ thêm check trường hợp diffDays = 0
  useEffect(() => {
    if (room && formData.checkIn && formData.checkOut && formData.roomCount) {
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        
        // Tính số ngày chênh lệch
        const diffTime = end - start; // Không cần Math.abs nếu validate checkOut > checkIn
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 0) {
            setTotalPrice(room.price * diffDays * formData.roomCount);
        } else {
             // Trường hợp chọn cùng ngày hoặc lỗi, fallback về giá gốc
             setTotalPrice(room.price * formData.roomCount); 
        }
    }
  }, [formData.checkIn, formData.checkOut, formData.roomCount, room]);

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.age || formData.age < 18) newErrors.age = "Phải trên 18 tuổi";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập SĐT";
    if (!formData.email) newErrors.email = "Vui lòng nhập Email";
    if (!formData.peopleCount || formData.peopleCount < 1) newErrors.peopleCount = "Ít nhất 1 người";
    if (!formData.roomCount || formData.roomCount < 1) newErrors.roomCount = "Ít nhất 1 phòng";

    if (!formData.checkIn) {
        newErrors.checkIn = "Chọn ngày nhận phòng";
    } else if (new Date(formData.checkIn) < today) {
        newErrors.checkIn = "Ngày nhận phòng không được ở quá khứ";
    }

    if (!formData.checkOut) {
        newErrors.checkOut = "Chọn ngày trả phòng";
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = "Ngày trả phòng phải sau ngày nhận phòng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check Auth
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
        toast.error("Vui lòng đăng nhập để đặt phòng!");
        navigate('/login'); // Chuyển sang login
        return;
    }

    if (!validate()) {
        toast.warning("Vui lòng kiểm tra lại thông tin nhập vào!");
        return;
    }

    const bookingPayload = {
        users_id: currentUser.id,
        rooms_id: room.id,
        check_in_date: formData.checkIn,
        check_out_date: formData.checkOut,
        total_price: totalPrice,
        people_count: formData.peopleCount,
        room_count: formData.roomCount,
        guest_name: formData.fullName,
        guest_phone: formData.phone,
        guest_email: formData.email,
        guest_requests: formData.requests
    };

    try {
        const result = await bookingService.create(bookingPayload);

        // 3. SỬA LỖI: Chỉ xử lý kết quả 1 lần duy nhất ở đây
        if (result.success) {
            toast.success("Đã tạo đơn! Đang chuyển trang thanh toán...");
            // Lưu ý: Đảm bảo backend trả về đúng key là 'bookingId' hay 'booking.id'
            // Ở đây mình dùng result.bookingId theo code cũ của bạn
            navigate(`/payment/${result.bookingId}`);
        } else {
            toast.error("Lỗi đặt phòng: " + (result.error || "Không xác định"));
        }
    } catch (err) {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!room) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Header />
      <section className="breadcumb-area bg-img d-flex align-items-center justify-content-center" style={{backgroundImage: "url('https://ezcloud.vn/wp-content/uploads/2023/05/kinh-nghiem-dat-phong-khach-san-da-lat-gia-re-scaled.webp')", height: '400px'}}>
        <div className="bradcumbContent">
            <h2 className="mb-4 text-center text-lobster" style={{color: '#736de9ff', fontSize: '50px' }}>Đặt phòng</h2>
        </div>
      </section>

      <section className="contact-form-area mb-100 mt-50">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="section-heading text-center">
                        <div className="line-"></div>
                        <h2>Đặt phòng: {room.name}</h2>
                        <h4 className="mt-2" style={{ color: '#8597f1ff', fontWeight: 'bold', fontSize: '24px' }}>
                            Chi phí dự kiến: ${totalPrice}
                        </h4>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4" style={{background: '#f8f9fa', borderRadius: '5px'}}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Ngày nhận phòng (Check-in) <span className="text-danger">*</span></label>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors.checkIn ? 'is-invalid' : ''}`} 
                                    name="checkIn" 
                                    value={formData.checkIn} // Thêm value binding
                                    onChange={handleChange} 
                                />
                                {errors.checkIn && <small className="text-danger">{errors.checkIn}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Ngày trả phòng (Check-out) <span className="text-danger">*</span></label>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors.checkOut ? 'is-invalid' : ''}`} 
                                    name="checkOut" 
                                    value={formData.checkOut} // Thêm value binding
                                    onChange={handleChange} 
                                />
                                {errors.checkOut && <small className="text-danger">{errors.checkOut}</small>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Họ và tên <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} 
                                    name="fullName" 
                                    value={formData.fullName} // Thêm value binding
                                    onChange={handleChange} 
                                />
                                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Tuổi <span className="text-danger">*</span></label>
                                <input 
                                    type="number" 
                                    className={`form-control ${errors.age ? 'is-invalid' : ''}`} 
                                    name="age" 
                                    value={formData.age} // Thêm value binding
                                    onChange={handleChange} 
                                />
                                {errors.age && <small className="text-danger">{errors.age}</small>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label>Số điện thoại <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`} 
                                    name="phone" 
                                    value={formData.phone} // Thêm value binding
                                    onChange={handleChange} 
                                />
                                {errors.phone && <small className="text-danger">{errors.phone}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Email <span className="text-danger">*</span></label>
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                    name="email" 
                                    value={formData.email} // Thêm value binding
                                    onChange={handleChange} 
                                />
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
                                <label>Yêu cầu thêm</label>
                                <textarea className="form-control" name="requests" rows="3" value={formData.requests} onChange={handleChange}></textarea>
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