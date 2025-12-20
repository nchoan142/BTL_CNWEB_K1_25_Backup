import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';

const Header = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="header-area">
      <div className="palatin-main-menu">
        <div className="classy-nav-container breakpoint-off">
          <div className="container">
            <nav className="classy-navbar justify-content-between" id="palatinNav">
              <Link to="/" className="nav-brand">The Palatin</Link>
              <div className="classy-menu">
                <div className="classynav">
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/rooms">Rooms</Link></li>
                    {user ? (
                      <>
                        {user.role === 'admin' ? (
                          <>
                            <li><Link to="/admin">Quản lý Phòng</Link></li>
                            <li><Link to="/admin-bookings">Quản lý Đặt phòng</Link></li>
                          </>
                        ) : (
                          <li><Link to="/history">Lịch sử</Link></li>
                        )}
                        <li><a href="#" onClick={handleLogout}>Logout ({user.username})</a></li>
                      </>
                    ) : (
                      <li><Link to="/login">Login</Link></li>
                    )}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;