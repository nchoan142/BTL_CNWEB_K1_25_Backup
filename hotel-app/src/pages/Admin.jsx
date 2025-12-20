// src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { roomService, authService } from '../utils/api';
import { toast } from 'react-toastify';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  
  // State quản lý form
  const [form, setForm] = useState({ name: '', price: '', image: '/img/bg-img/bg-1.jpg', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      toast.error("Bạn không có quyền truy cập trang!");
      navigate('/login');
    }
    setRooms(roomService.getAll());
  }, [navigate]);

  const handleSubmit = () => {
    if(!form.name || !form.price || !form.image || !form.description) {
        return toast.warning("Vui lòng điền đầy đủ thông tin (bao gồm mô tả)!");
    }

    if (isEditing) {
        const updatedRooms = roomService.update(editId, form);
        setRooms(updatedRooms);
        toast.success(`Cập nhật phòng #${editId} thành công!`);
        setIsEditing(false);
        setEditId(null);
    } else {
        const updatedRooms = roomService.add(form);
        setRooms(updatedRooms);
        toast.success("Đã thêm phòng mới thành công!");
    }
    // Reset form
    setForm({ name: '', price: '', image: '/img/bg-img/bg-1.jpg', description: '' });
  };

  const handleEditClick = (room) => {
      setForm(room);
      setIsEditing(true);
      setEditId(room.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setIsEditing(false);
      setEditId(null);
      setForm({ name: '', price: '', image: '/img/bg-img/1.jpg', description: '' });
      toast.info("Đã hủy chế độ sửa.");
  };

  const handleDelete = (id) => {
    if(window.confirm("Bạn chắc chắn muốn xóa phòng này?")) {
      const updatedRooms = roomService.delete(id);
      setRooms(updatedRooms);
      toast.success("Đã xóa phòng thành công!");
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{marginTop: '150px', marginBottom: '100px'}}>
      {/* Tìm và sửa dòng tiêu đề này */}
<h2 className="mb-4 text-center text-lobster" style={{color: '#736de9ff', fontSize: '50px' }}>
    Quản lý phòng
</h2>
        
        {/* --- KHUNG LỚN CHỨA TẤT CẢ (GỘP FORM VÀ BẢNG) --- */}
        <div className="card shadow-lg border-0">
            <div className="card-body p-4">

                {/* --- PHẦN 1: FORM NHẬP LIỆU --- */}
                {/* Nếu đang sửa thì nền vàng nhạt, bình thường thì nền trắng */}
                <div 
                    className="p-3 mb-4 rounded" 
                    style={{
                        backgroundColor: isEditing ? '#fff3cd' : '#f8f9fa', 
                        border: isEditing ? '1px solid #ffeeba' : '1px dashed #ced4da'
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0" style={{color: isEditing ? '#856404' : '#333'}}>
                            {isEditing ? `✏️ Đang sửa phòng ID: ${editId}` : '➕ Thêm phòng mới'}
                        </h4>
                        {isEditing && <button className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>Hủy bỏ</button>}
                    </div>
                    
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label>Tên phòng</label>
                            <input className="form-control" placeholder="Tên phòng" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </div>
                        
                        <div className="col-md-2 mb-2">
                            <label>Giá ($)</label>
                            <input className="form-control" type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                        </div>

                        <div className="col-md-7 mb-2">
                            <label>Link ảnh</label>
                            <input className="form-control" type="text" placeholder="/img/bg-img/..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label>Mô tả phòng <span className="text-danger">*</span></label>
                            <textarea 
                                className="form-control" 
                                rows="2" 
                                placeholder="Nhập mô tả chi tiết về phòng..." 
                                value={form.description} 
                                onChange={e => setForm({...form, description: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="col-md-12 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <small className="mr-2 text-muted">Xem trước ảnh: </small>
                                <img src={form.image} alt="Preview" style={{height: '50px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd'}} onError={(e) => e.target.src = 'https://via.placeholder.com/100x60?text=No+Image'} />
                            </div>
                            <button className={`btn px-4 ${isEditing ? 'btn-warning' : 'palatin-btn'}`} onClick={handleSubmit}>
                                {isEditing ? 'Lưu thay đổi' : 'Thêm Ngay'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ĐƯỜNG KẺ PHÂN CÁCH */}
                <hr className="my-4" />

                {/* --- PHẦN 2: BẢNG DANH SÁCH --- */}
                <h4 className="mb-3">Danh sách phòng hiện có</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover mb-0">
                        <thead className="thead-light">
                            <tr>
                                <th style={{width: '5%'}}>ID</th>
                                <th style={{width: '15%'}}>Ảnh</th>
                                <th style={{width: '20%'}}>Tên Phòng</th>
                                <th style={{width: '30%'}}>Mô tả</th>
                                <th style={{width: '10%'}}>Giá</th>
                                <th style={{width: '20%'}}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.length > 0 ? rooms.map(r => (
                                <tr key={r.id}>
                                    <td className="align-middle text-center font-weight-bold">{r.id}</td>
                                    <td className="align-middle">
                                        <img src={r.image} style={{width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} alt="" onError={(e) => e.target.src = 'https://via.placeholder.com/100x60'}/>
                                    </td>
                                    <td className="align-middle font-weight-bold">{r.name}</td>
                                    <td className="align-middle"><small>{r.description}</small></td>
                                    <td className="align-middle text-success font-weight-bold">${r.price}</td>
                                    <td className="align-middle">
                                        <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditClick(r)}>
                                            <i className="fa fa-pencil"></i> Sửa
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
                                            <i className="fa fa-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="text-center py-4">Chưa có phòng nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div> {/* End card-body */}
        </div> {/* End card */}
      </div>
    </>
  );
};

export default Admin;