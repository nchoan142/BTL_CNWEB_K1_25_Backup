import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
// SỬA Ở ĐÂY: Import authService thay vì registerUser
import { authService } from '../utils/api'; 

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        if (!formData.username || !formData.password || !formData.email) {
            toast.warn("Vui lòng điền các thông tin bắt buộc!");
            setLoading(false);
            return;
        }

        try {
            // authService bây giờ đã được import nên dòng này sẽ chạy đúng
            const data = await authService.register(formData);

            if (data.success) {
                toast.success(data.message || "Đăng ký thành công!");
                navigate('/login');
            } else {
                toast.error(data.error || "Đăng ký thất bại");
            }
        } catch (error) {
            console.error(error); // Log lỗi ra console để dễ debug
            toast.error("Lỗi kết nối server!");
        } finally {
            setLoading(false);
        }
    };

    const darkFormStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '40px',
        borderRadius: '5px',
        color: '#fff', 
        marginTop: '150px',
        marginBottom: '100px'
    };

    const whiteLabelStyle = {
        color: '#eee',
        fontWeight: 500,
        marginBottom: '5px',
        display: 'block'
    };

    const darkLabelStyle = {
        color: '#000000ff',
        fontWeight: 500,
        marginBottom: '5px',
        display: 'block'
    };
    
    const customInputStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        height: '50px'
    };

    return (
        <>
            <Header />
            <section className="contact-form-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 col-xl-7">
                            
                            <div style={darkFormStyle}>
                                <div className="section-heading text-center mb-4">
                                    <h2 style={{ color: '#cb8670' }}>Đăng Ký Tài Khoản</h2>
                                    <p style={{ color: '#ccc' }}>Điền thông tin để trở thành thành viên của Palatin</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group mb-4">
                                                <label style={darkLabelStyle}>Tên đăng nhập (*)</label>
                                                <input 
                                                    type="text" className="form-control" style={customInputStyle}
                                                    name="username" value={formData.username} onChange={handleChange} required
                                                />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label style={darkLabelStyle}>Mật khẩu (*)</label>
                                                <input 
                                                    type="password" className="form-control" style={customInputStyle}
                                                    name="password" value={formData.password} onChange={handleChange} required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                             <div className="form-group mb-4">
                                                <label style={darkLabelStyle}>Họ và Tên</label>
                                                <input 
                                                    type="text" className="form-control" style={customInputStyle}
                                                    name="full_name" value={formData.full_name} onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label style={darkLabelStyle}>Email (*)</label>
                                                <input 
                                                    type="email" className="form-control" style={customInputStyle}
                                                    name="email" value={formData.email} onChange={handleChange} required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-12">
                                             <div className="form-group mb-5">
                                                <label style={darkLabelStyle}>Số điện thoại</label>
                                                <input 
                                                    type="text" className="form-control" style={customInputStyle}
                                                    name="phone" value={formData.phone} onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 text-center">
                                            <button 
                                                type="submit" 
                                                className="btn palatin-btn btn-block"
                                                style={{ padding: '15px', fontSize: '16px' }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐĂNG KÝ'}
                                            </button>
                                        </div>

                                        <div className="col-12 text-center mt-3">
                                            <span style={{ color: '#ccc' }}>Đã có tài khoản? </span>
                                            <Link to="/login" style={{ color: '#cb8670', fontWeight: 'bold' }}>
                                                Đăng nhập ngay
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Register;