import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';
import Header from '../components/Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const result = authService.login(username, password);
    if (result.success) {
      alert("Đăng nhập thành công!");
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    } else {
      alert("Sai thông tin! (Gợi ý: admin/123)");
    }
  };

  return (
    <>
      <Header />
      <section className="contact-form-area mb-100" style={{marginTop: '150px'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="section-heading text-center">
                <h2>Đăng Nhập</h2>
              </div>
              <div className="form-group">
                <input 
                  className="form-control" 
                  placeholder="Username (admin/user)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Password (123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn palatin-btn btn-block" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;