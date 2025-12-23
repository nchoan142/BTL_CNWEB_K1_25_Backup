// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Thêm state loading để khóa nút khi đang gọi API
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  // 1. Thêm từ khóa 'async' vào hàm xử lý
  const handleLogin = async () => {
    if (!username || !password) {
        toast.warning("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    setLoading(true); // Bắt đầu loading

    try {
        // 2. Thêm 'await' để đợi Server trả lời
        const result = await authService.login(username, password);
        
        if (result.success) {
            toast.success(`Chào mừng bạn quay trở lại!`);
            // Chuyển hướng dựa trên role
            if (result.user.username === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
            // navigate(result.user.role === 'admin' ? '/admin' : '/');
        } else {
            toast.error(result.message || "Sai tài khoản hoặc mật khẩu!");
        }
    } catch (error) {
        console.error(error);
        toast.error("Không thể kết nối đến Server!");
    } finally {
        setLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };

  const handleRegister = () => {
    navigate('/register'); 
  };

  // Hàm xử lý khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
  }

  return (
    <>
      <Header />
      <section className="contact-form-area mb-100" style={{marginTop: '150px'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="section-heading text-center">
                <h2>Chào mừng đến Palatin</h2>
              </div>
              
              <div className="form-group">
                <input 
                  className="form-control" 
                  placeholder="Username (admin/user)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown} // Cho phép nhấn Enter để login
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Password (123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <button 
                className="btn palatin-btn btn-block" 
                onClick={handleLogin}
                disabled={loading} // Khóa nút khi đang xử lý
              >
                {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
              </button>

              <div className="text-center mt-4">
                <span style={{ color: '#777' }}>
                  Bạn chưa có tài khoản? 
                </span>
                <br />
                <button 
                    className="btn palatin-btn btn-block" 
                    style={{ 
                        marginTop: '10px', 
                        backgroundColor: '#6c757d', 
                        borderColor: '#6c757d' 
                    }} 
                    onClick={handleRegister}
                    disabled={loading}
                >
                    Đăng Ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;