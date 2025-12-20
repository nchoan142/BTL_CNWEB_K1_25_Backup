// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  // Hàm cuộn xuống phần lịch sử
  const scrollToHistory = () => {
    const section = document.getElementById('history-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />

      {/* --- 1. HERO AREA (BANNER LỚN) --- */}
      <section 
        className="hero-area d-flex align-items-center justify-content-center"
        style={{
            backgroundImage: "url('/img/bg-img/bg-3.jpg')",
            height: '600px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}
      >
        {/* Lớp phủ đen mờ */}
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', zIndex: 0}}></div>

        <div className="container" style={{position: 'relative', zIndex: 2}}>
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 text-center">
                    
                    <div className="hero-text">
                        {/* 1. Tên Khách Sạn */}
                        <h2 
                            className="text-lobster" 
                            data-animation="fadeInUp" 
                            data-delay="100ms" 
                            style={{
                                fontSize: '100px', 
                                color: 'white', 
                                textShadow: '4px 4px 8px #000',
                                marginBottom: '20px'
                            }}
                        >
                            The Palatin
                        </h2>

                        {/* 2. KHUNG CHỮ GIỚI THIỆU */}
                        <div 
                            data-animation="fadeInUp" 
                            data-delay="300ms"
                            style={{
                                backgroundColor: 'rgba(11, 28, 61, 0.9)', 
                                padding: '30px 50px',       
                                borderRadius: '0px',
                                display: 'inline-block',
                                maxWidth: '800px',          
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {/* QUAN TRỌNG: Dùng thẻ <div> thay vì <p> để tránh bị file CSS ép màu tím */}
                            <div style={{
                                color: '#ffffff', /* Chắc chắn sẽ trắng */
                                fontSize: '18px',           
                                margin: 0,
                                lineHeight: '1.8',
                                fontWeight: '400',          
                                letterSpacing: '1px',
                                textAlign: 'center'
                            }}>
                                Trải nghiệm sự sang trọng và đẳng cấp bậc nhất.<br/>
                                Nơi lưu giữ những khoảnh khắc đáng nhớ của bạn và gia đình.
                            </div>
                        </div>
                        
                        {/* 3. Nút Khám Phá (Căn giữa hoàn hảo) */}
                        <div className="mt-50" data-animation="fadeInUp" data-delay="500ms">
                            <button 
                                className="btn palatin-btn" 
                                onClick={scrollToHistory}
                                style={{ 
                                    borderRadius: '0px',
                                    height: '60px',             /* Chiều cao cố định */
                                    padding: '0 40px',          /* Chiều rộng thoáng */
                                    fontSize: '18px',
                                    
                                    /* CĂN GIỮA CHỮ TRONG NÚT */
                                    display: 'inline-flex',     
                                    alignItems: 'center',       /* Căn giữa dọc */
                                    justifyContent: 'center',   /* Căn giữa ngang */
                                    
                                    margin: '0 auto',           /* Căn giữa nút so với màn hình */
                                    border: 'none'
                                }} 
                            >
                                Khám Phá Ngay
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </section>

      {/* --- 2. ABOUT & HISTORY SECTION --- */}
      <section id="history-section" className="about-us-area section-padding-100-0" style={{padding: '80px 0'}}>
        <div className="container">
            <div className="row align-items-center">
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
                <div className="col-12 col-lg-6">
                    <div className="about-thumbnail mb-100">
                        <img src="/img/bg-img/2.jpg" alt="" style={{width: '100%', borderRadius: '5px', border: '2px solid var(--border-color)'}} onError={(e) => e.target.src = 'https://via.placeholder.com/500x350'} />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 3. ACTIVITIES & SERVICES --- */}
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
                {/* Hoạt động 1 */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="single-rooms-area"> 
                        <div className="bg-thumbnail bg-img" style={{backgroundImage: "url('https://puluongbocbandiretreat.com/UploadFile/be-boi-vo-cuc1.jpg')"}}></div>
                        <div className="rooms-text">
                            <div className="line"></div>
                            <h4>Hồ bơi vô cực</h4>
                            <p>Thư giãn tại hồ bơi ngoài trời với tầm nhìn toàn cảnh ra biển.</p>
                        </div>
                    </div>
                </div>

                {/* Hoạt động 2 */}
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

                 {/* Hoạt động 3 */}
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