import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
// 1. Xóa initData khỏi dòng import
import { roomService } from '../utils/api'; 

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Cách gọi dữ liệu mới (Dùng async/await để đợi server trả lời)
    const fetchRooms = async () => {
        const data = await roomService.getAll();
        setRooms(data);
    };
    
    fetchRooms(); // Gọi hàm chạy
  }, []);

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
            {/* Kiểm tra nếu có dữ liệu thì mới hiển thị */}
            {rooms.length > 0 ? (
                rooms.map(room => (
                  <div className="col-12 col-md-6 col-lg-4" key={room.id}>
                    <div className="single-rooms-area wow fadeInUp" data-wow-delay="100ms">
                      <div 
                        className="bg-thumbnail bg-img" 
                        // Lưu ý: Đảm bảo trong Database cột ảnh tên là 'image' (hoặc sửa thành room.image_url tùy DB của bạn)
                        style={{backgroundImage: `url(${room.image})`}}
                      ></div>
                      
                      {/* room.price_per_night hoặc room.price tùy tên cột trong DB */}
                      <p className="price-from">Chỉ từ ${room.price}/đêm</p> 
                      <div className="rooms-text">
                        <div className="line"></div>
                        {/* room.room_number hoặc room.type_name tùy bạn muốn hiện tên gì */}
                        <h4>{room.type_name || room.room_number}</h4> 
                        <p>{room.description || "Mô tả đang cập nhật..."}</p>
                      </div>
                      
                      <button 
                          className="book-room-btn btn palatin-btn"
                          onClick={() => handleBookClick(room.id)}
                      >
                          Đặt Phòng
                      </button>
                    </div>
                  </div>
                ))
            ) : (
                <div className="col-12 text-center">
                    <p>Đang tải dữ liệu hoặc chưa có phòng nào...</p>
                </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Rooms;