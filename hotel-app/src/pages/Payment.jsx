// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { bookingService } from '../utils/api';
import { toast } from 'react-toastify';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  
  // State lựa chọn: 'now' (Thanh toán ngay) hoặc 'hotel' (Tại khách sạn)
  const [paymentOption, setPaymentOption] = useState('now'); 
  
  // State phương thức thanh toán (chỉ dùng khi chọn 'now')
  const [method, setMethod] = useState('qr'); // qr, momo, paypal

  useEffect(() => {
    const data = bookingService.getById(bookingId);
    if (data) {
      setBooking(data);
    } else {
      alert("Không tìm thấy đơn hàng!");
      navigate('/rooms');
    }
  }, [bookingId, navigate]);

  if (!booking) return <div>Loading...</div>;

  // Tính toán giá
  const originalPrice = parseInt(booking.price) * parseInt(booking.customer.roomCount);
  const discountAmount = originalPrice * 0.05; // 5%
  const discountedPrice = originalPrice - discountAmount;

  const handleConfirm = () => {
    if (paymentOption === 'now') {
      // Logic thanh toán ngay
      bookingService.updateStatus(booking.id, 'Paid', method, discountedPrice);
      toast.success(`Thanh toán thành công qua ${method.toUpperCase()}!`);
    } else {
      // Logic thanh toán sau
      bookingService.updateStatus(booking.id, 'Pay at Hotel', 'Cash', originalPrice);
      toast.info("Đã xác nhận! Vui lòng thanh toán khi nhận phòng.");
    }
    navigate('/'); // Về trang chủ
  };

  return (
    <>
      <Header />
      <div className="container" style={{marginTop: '150px', marginBottom: '100px'}}>
        <h2 className="text-center mb-4">Thanh Toán & Xác Nhận</h2>

        <div className="row">
          {/* Cột trái: Thông tin đơn hàng */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">Thông tin đặt phòng</div>
              <div className="card-body">
                <p><strong>Phòng:</strong> {booking.roomName}</p>
                <p><strong>Khách hàng:</strong> {booking.customer.fullName}</p>
                <p><strong>Check-in:</strong> {booking.checkIn || '20/10/2025'}</p>
                <hr />
                <p><strong>Giá gốc:</strong> ${originalPrice}</p>
                {paymentOption === 'now' && (
                  <p className="text-success"><strong>Voucher giảm 5%:</strong> -${discountAmount}</p>
                )}
                <h4 className="mt-2 text-danger">
                  Tổng: ${paymentOption === 'now' ? discountedPrice : originalPrice}
                </h4>
              </div>
            </div>
          </div>

          {/* Cột phải: Lựa chọn thanh toán */}
          <div className="col-md-8">
            <div className="card shadow-sm p-4">
              <h4>Chọn hình thức thanh toán:</h4>
              
              {/* Option 1: Thanh toán ngay */}
              <div 
                className={`option-card p-3 mb-3 border rounded ${paymentOption === 'now' ? 'border-primary bg-light' : ''}`}
                onClick={() => setPaymentOption('now')}
                style={{cursor: 'pointer', position: 'relative'}}
              >
                <div className="custom-control custom-radio">
                  <input type="radio" checked={paymentOption === 'now'} onChange={() => setPaymentOption('now')} className="custom-control-input" />
                  <label className="custom-control-label font-weight-bold ml-2">Thanh toán ngay (Giảm 5%)</label>
                </div>
                <small className="text-muted ml-4 d-block">Thanh toán qua QR, Momo, Paypal để nhận ưu đãi.</small>
                {paymentOption === 'now' && <span className="badge badge-danger position-absolute" style={{top: 10, right: 10}}>-5% OFF</span>}
              </div>

              {/* Option 2: Thanh toán tại khách sạn */}
              <div 
                className={`option-card p-3 mb-3 border rounded ${paymentOption === 'hotel' ? 'border-primary bg-light' : ''}`}
                onClick={() => setPaymentOption('hotel')}
                style={{cursor: 'pointer'}}
              >
                 <div className="custom-control custom-radio">
                  <input type="radio" checked={paymentOption === 'hotel'} onChange={() => setPaymentOption('hotel')} className="custom-control-input" />
                  <label className="custom-control-label font-weight-bold ml-2">Thanh toán tại khách sạn</label>
                </div>
                <small className="text-muted ml-4 d-block">Thanh toán toàn bộ ${originalPrice} khi nhận phòng.</small>
              </div>

              {/* Khu vực hiển thị phương thức thanh toán (Chỉ hiện khi chọn 'now') */}
              {paymentOption === 'now' && (
                <div className="payment-methods mt-4 animate__animated animate__fadeIn">
                   <h5 className="mb-3">Chọn cổng thanh toán:</h5>
                   
                   <div className="row text-center">
                      {/* Nút QR */}
                      <div className="col-4">
                        <button className={`btn btn-block ${method === 'qr' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMethod('qr')}>
                          QR Code
                        </button>
                      </div>
                      {/* Nút Momo */}
                      <div className="col-4">
                        <button className={`btn btn-block ${method === 'momo' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMethod('momo')}>
                          MoMo Wallet
                        </button>
                      </div>
                      {/* Nút PayPal */}
                      <div className="col-4">
                        <button className={`btn btn-block ${method === 'paypal' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMethod('paypal')}>
                          PayPal
                        </button>
                      </div>
                   </div>

                   {/* Nội dung chi tiết từng cổng */}
                   <div className="method-content mt-4 text-center p-4 border rounded bg-white">
                      {method === 'qr' && (
                        <div>
                          <p>Quét mã QR ngân hàng:</p>
                          {/* Dùng ảnh placeholder QR code */}
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePayment" alt="QR Code" />
                          <p className="mt-2 text-muted">Nội dung: <strong>BOOK{booking.id}</strong></p>
                        </div>
                      )}
                      
                      {method === 'momo' && (
                        <div>
                           <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{width: '80px'}} />
                           <p className="mt-2">Mở ứng dụng MoMo để quét mã hoặc chuyển khoản.</p>
                        </div>
                      )}

                      {method === 'paypal' && (
                         <div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{width: '100px'}} />
                            <p className="mt-2">Bạn sẽ được chuyển hướng đến PayPal để hoàn tất.</p>
                         </div>
                      )}
                   </div>
                </div>
              )}

              <button className="btn palatin-btn btn-block mt-4 btn-lg" onClick={handleConfirm}>
                {paymentOption === 'now' ? `Thanh toán $${discountedPrice}` : 'Xác nhận đặt phòng'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment;