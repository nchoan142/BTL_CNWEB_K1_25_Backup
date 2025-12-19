// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />

      {/* --- 1. HERO AREA (BANNER LỚN) --- */}
      <section 
        className="hero-area d-flex align-items-center justify-content-center"
        style={{
            backgroundImage: "url('/img/bg-img/bg-3.jpg')", // Ảnh nền chính
            height: '600px', // Chiều cao banner
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}
      >
        {/* Lớp phủ màu đen mờ để chữ nổi hơn */}
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)'}}></div>

        <div className="container position-relative z-index-1 text-center">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <h2 style={{
                        fontFamily: "'Lobster', cursive", 
                        fontSize: '80px', 
                        color: 'var(--accent-pink)', // Màu hồng bạn đã chọn
                        marginBottom: '20px'
                    }}>
                        The Palatin
                    </h2>
                    <p style={{color: '#f9c5f1ff', fontSize: '20px', marginBottom: '40px'}}>
                        Trải nghiệm sự sang trọng và đẳng cấp bậc nhất. Nơi lưu giữ những khoảnh khắc đáng nhớ của bạn và gia đình.
                    </p>
                    <Link to="/rooms" className="btn palatin-btn">Khám phá Phòng Ngay</Link>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. ABOUT & HISTORY SECTION (GIỚI THIỆU & LỊCH SỬ) --- */}
      <section className="about-us-area section-padding-100-0" style={{padding: '80px 0'}}>
        <div className="container">
            <div className="row align-items-center">
                {/* Cột ảnh minh họa */}
                <div className="col-12 col-lg-6">
                    <div className="about-text mb-100">
                        <div className="section-heading">
                            <div className="line-"></div>
                            <h2>Lịch sử hình thành</h2>
                        </div>
                        <p>Được thành lập vào năm 2010, The Palatin khởi nguồn từ một biệt thự cổ điển bên bờ biển. Trải qua hơn 15 năm phát triển, chúng tôi đã vươn mình trở thành một trong những khu nghỉ dưỡng 5 sao hàng đầu khu vực.</p>
                        <p className="mt-3">Với kiến trúc kết hợp giữa nét cổ điển Châu Âu và vẻ đẹp nhiệt đới hiện đại, The Palatin không chỉ là nơi lưu trú, mà là một tác phẩm nghệ thuật kiến trúc bền vững với thời gian.</p>
                        <Link to="/rooms" className="btn palatin-btn mt-50">Đặt phòng ngay</Link>
                    </div>
                </div>
                {/* Cột ảnh ghép */}
                <div className="col-12 col-lg-6">
                    <div className="about-thumbnail mb-100">
                        <img src="/img/bg-img/2.jpg" alt="" style={{width: '100%', borderRadius: '5px', border: '2px solid var(--border-color)'}} />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 3. ACTIVITIES & SERVICES (CÁC HOẠT ĐỘNG) --- */}
      <section className="our-hotels-area section-padding-100-0" style={{background: '#f9f9f9', padding: '80px 0'}}>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="section-heading text-center">
                        <div className="line-"></div>
                        <h2>Hoạt động nổi bật</h2>
                        <p>Tận hưởng các dịch vụ đẳng cấp thế giới ngay tại khuôn viên khách sạn</p>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                {/* Hoạt động 1: Hồ bơi */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="single-rooms-area"> {/* Tái sử dụng class card phòng để có hiệu ứng zoom */}
                        <div className="bg-thumbnail bg-img" style={{backgroundImage: "url('https://puluongbocbandiretreat.com/UploadFile/be-boi-vo-cuc1.jpg')"}}></div>
                        <div className="rooms-text">
                            <div className="line"></div>
                            <h4>Hồ bơi vô cực</h4>
                            <p>Thư giãn tại hồ bơi ngoài trời với tầm nhìn toàn cảnh ra biển.</p>
                        </div>
                    </div>
                </div>

                {/* Hoạt động 2: Nhà hàng */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="single-rooms-area">
                        <div className="bg-thumbnail bg-img" style={{backgroundImage: "url('https://thietbibuffet.vn/wp-content/uploads/2021/03/nha-hang-5-sao-600x400.jpg')"}}></div>
                        <div className="rooms-text">
                            <div className="line"></div>
                            <h4>Nhà hàng 5 sao</h4>
                            <p>Thưởng thức ẩm thực Á - Âu được chế biến bởi các đầu bếp hàng đầu.</p>
                        </div>
                    </div>
                </div>

                 {/* Hoạt động 3: Spa */}
                 <div className="col-12 col-md-6 col-lg-4">
                    <div className="single-rooms-area">
                        <div className="bg-thumbnail bg-img" style={{backgroundImage: "url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/f7/03/67/cabina-duo-de-spa-del.jpg?w=700&h=400&s=1')"}}></div>
                        <div className="rooms-text">
                            <div className="line"></div>
                            <h4>Spa & Wellness</h4>
                            <p>Liệu trình massage và chăm sóc sức khỏe giúp bạn phục hồi năng lượng.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;