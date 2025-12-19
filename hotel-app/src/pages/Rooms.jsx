import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import Header from '../components/Header';
import Footer from '../components/Footer';
import { roomService, initData } from '../utils/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  useEffect(() => {
    initData();
    setRooms(roomService.getAll());
  }, []);

  // Hàm xử lý mới: Chỉ chuyển trang, không book ngay
  const handleBookClick = (roomId) => {
    navigate(`/booking/${roomId}`); 
  };

  return (
    <>
      <Header />
      <section 
        className="breadcumb-area bg-img d-flex align-items-center justify-content-center" 
        style={{backgroundImage: "url('https://hoanmydecor.vn/wp-content/uploads/2022/05/Phong-ngu-tan-co-dien-8.jpg')", height: '800px'}}
      >
        <div className="bradcumbContent">
            <h2>Rooms</h2>
        </div>
      </section>

      <section className="rooms-area section-padding-0-100 mt-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="section-heading text-center">
                <div className="line-"></div>
                <h2>Danh sách các phòng</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {rooms.map(room => (
              <div className="col-12 col-md-6 col-lg-4" key={room.id}>
                <div className="single-rooms-area wow fadeInUp" data-wow-delay="100ms">
                  <div 
                    className="bg-thumbnail bg-img" 
                    style={{backgroundImage: `url(${room.image})`}}
                  ></div>
                  
                  <p className="price-from">Chỉ từ ${room.price}/đêm</p>
                  <div className="rooms-text">
                    <div className="line"></div>
                    <h4>{room.name}</h4>
                    <p>{room.description || "Mô tả đang cập nhật..."}</p>
                  </div>
                  
                  {/* SỬA NÚT BOOK ROOM TẠI ĐÂY */}
                  <button 
                      className="book-room-btn btn palatin-btn"
                      onClick={() => handleBookClick(room.id)}
                  >
                      Đặt Phòng
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Rooms;