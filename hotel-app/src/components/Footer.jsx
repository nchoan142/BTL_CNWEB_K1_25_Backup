// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-area" style={{
        backgroundImage: "url('/img/bg-img/bg-2.jpg')", // Dùng lại ảnh nền tối
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: '#fff',
        paddingTop: '80px',
        marginTop: '50px' // Cách phần trên một chút
    }}>
      {/* Lớp phủ màu đen để chữ trắng nổi bật */}
      <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(11, 28, 61, 0.95)', // Màu xanh đen đậm (95%)
          zIndex: 0
      }}></div>

      <div className="container" style={{position: 'relative', zIndex: 1}}>
        <div className="row">
          
          {/* CỘT 1: THƯƠNG HIỆU */}
          <div className="col-12 col-lg-5">
            <div className="footer-widget-area mt-50">
              <Link to="/" className="d-block mb-4">
                 {/* Dùng font Lobster cho Logo */}
                 <h2 className="text-lobster" style={{color: '#8586e9', fontSize: '40px'}}>The Palatin</h2>
              </Link>
              <p style={{color: '#b5b5b5'}}>
                Nơi dừng chân lý tưởng cho kỳ nghỉ của bạn. Chúng tôi cam kết mang đến trải nghiệm dịch vụ đẳng cấp 5 sao với không gian sang trọng và ấm cúng.
              </p>
            </div>
          </div>

          {/* CỘT 2: THÔNG TIN LIÊN HỆ (QUAN TRỌNG) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="footer-widget-area mt-50">
              <h6 className="text-white text-uppercase mb-4" style={{fontWeight: 'bold', borderBottom: '2px solid #8586e9', display: 'inline-block', paddingBottom: '5px'}}>
                  Liên hệ
              </h6>
              
              <div style={{marginBottom: '15px'}}>
                <i className="fa fa-map-marker" style={{color: '#8586e9', marginRight: '10px', width: '20px'}}></i>
                <span>Đường Nghiêm Xuân Yêm,Phường Định Công, Thành phố Hà Nội</span>
              </div>

              <div style={{marginBottom: '15px'}}>
                <i className="fa fa-phone" style={{color: '#8586e9', marginRight: '10px', width: '20px'}}></i>
                <span>Hotline: (+84) 912 345 678</span>
              </div>

              <div style={{marginBottom: '15px'}}>
                <i className="fa fa-envelope" style={{color: '#8586e9', marginRight: '10px', width: '20px'}}></i>
                <span>Email: booking@thepalatin.com</span>
              </div>

              <div style={{marginBottom: '15px'}}>
                <i className="fa fa-clock-o" style={{color: '#8586e9', marginRight: '10px', width: '20px'}}></i>
                <span>Hỗ trợ: 24/7</span>
              </div>
            </div>
          </div>

          {/* CỘT 3: LIÊN KẾT & MẠNG XÃ HỘI */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="footer-widget-area mt-50">
              <h6 className="text-white text-uppercase mb-4" style={{fontWeight: 'bold', borderBottom: '2px solid #8586e9', display: 'inline-block', paddingBottom: '5px'}}>
                  Theo dõi
              </h6>
              
              <div className="footer-social-info d-flex align-items-center">
                  <a href="#" style={{color: '#fff', fontSize: '20px', marginRight: '20px'}}><i className="fa fa-facebook"></i></a>
                  <a href="#" style={{color: '#fff', fontSize: '20px', marginRight: '20px'}}><i className="fa fa-instagram"></i></a>
                  <a href="#" style={{color: '#fff', fontSize: '20px', marginRight: '20px'}}><i className="fa fa-twitter"></i></a>
                  <a href="#" style={{color: '#fff', fontSize: '20px'}}><i className="fa fa-youtube-play"></i></a>
              </div>
              
              <div className="mt-4">
                  <Link to="/rooms" className="btn palatin-btn btn-sm">Đặt phòng ngay</Link>
              </div>
            </div>
          </div>

        </div>

        {/* DÒNG BẢN QUYỀN CUỐI CÙNG */}
        <div className="row">
            <div className="col-12">
                <div className="copywrite-text mt-30 py-3 text-center border-top border-secondary">
                    <p style={{margin: 0, fontSize: '14px', color: '#888'}}>
                        Copyright &copy; {new Date().getFullYear()} All rights reserved | The Palatin Hotel
                    </p>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;