// src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { roomService, authService } from '../utils/api';
import { toast } from 'react-toastify';
// Component hiển thị bên trong Toast
const ConfirmDeleteMsg = ({ closeToast, onConfirm }) => (
  <div>
    <h6 style={{marginBottom: '10px'}}>Bạn có chắc chắn muốn xóa?</h6>
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      {/* Nút Hủy: chỉ đóng toast */}
      <button 
        className="btn btn-secondary btn-sm mr-2" 
        onClick={closeToast}
      >
        Hủy
      </button>

      {/* Nút Xóa: chạy hàm xóa rồi đóng toast */}
      <button 
        className="btn btn-danger btn-sm" 
        onClick={() => {
          onConfirm(); 
          closeToast();
        }}
      >
        Xóa ngay
      </button>
    </div>
  </div>
);
const Admin = () => {
  const [rooms, setRooms] = useState([]);
  
  // 1. Thêm trường description vào state mặc định
  const [form, setForm] = useState({ name: '', price: '', image: '/img/bg-img/bg-1.jpg', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      toast.error("Bạn không có quyền truy cập trang Admin!");
      navigate('/login');
    }
    setRooms(roomService.getAll());
  }, [navigate]);

  const handleSubmit = () => {
    // 2. Thêm validation cho description
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
    // 1. Định nghĩa hành động sẽ làm nếu người dùng bấm "Xóa ngay"
    const performDelete = () => {
        const updatedRooms = roomService.delete(id);
        setRooms(updatedRooms);
        toast.success("Đã xóa phòng thành công!");
    };

    // 2. Hiện Toast chứa Component xác nhận ở trên
    // Quan trọng: autoClose: false để nó không tự biến mất
    toast.warn(
        <ConfirmDeleteMsg onConfirm={performDelete} />, 
        {
            position: "top-center",
            autoClose: false,    // Không tự tắt sau 3s
            closeOnClick: false, // Bấm vào không tắt
            draggable: false,    // Không cho kéo
            closeButton: false   // Tắt nút X nhỏ
        }
    );
  };

  return (
    <>
      <Header />
      <div className="container" style={{marginTop: '150px', marginBottom: '100px'}}>
        <h2 className="mb-4 text-center">Quản lý phòng</h2>
        
        <div className="row mt-30 p-4 shadow-sm" style={{background: isEditing ? '#fff3cd' : '#f8f9fa', borderRadius: '8px', border: isEditing ? '1px solid #ffeeba' : '1px solid #e9ecef'}}>
            <div className="col-12 mb-3">
                <h4 style={{color: isEditing ? '#856404' : 'inherit'}}>
                    {isEditing ? `✏️ Đang sửa phòng ID: ${editId}` : '➕ Thêm phòng mới'}
                </h4>
            </div>
            
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

            {/* 3. Thêm ô nhập mô tả (Textarea) */}
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

            <div className="col-md-2 mb-2">
                <button className={`btn w-100 ${isEditing ? 'btn-warning' : 'palatin-btn'}`} onClick={handleSubmit}>
                    {isEditing ? 'Lưu Sửa' : 'Thêm Ngay'}
                </button>
            </div>
             
            <div className="col-12 mt-3 d-flex align-items-center justify-content-between">
                <div>
                     {isEditing && <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Hủy bỏ</button>}
                </div>
                <div className="d-flex align-items-center">
                    <small className="mr-2 text-muted">Xem trước ảnh: </small>
                    <img src={form.image} alt="Preview" style={{height: '60px', width: '100px', objectFit: 'cover', borderRadius: '4px'}} onError={(e) => e.target.src = 'https://via.placeholder.com/100x60?text=No+Image'} />
                </div>
            </div>
        </div>

        <div className="table-responsive">
            <table className="table mt-50 table-bordered table-hover shadow-sm">
                <thead>
                    <tr>
                        <th style={{width: '5%'}}>ID</th>
                        <th style={{width: '15%'}}>Ảnh</th>
                        <th style={{width: '20%'}}>Tên Phòng</th>
                        <th style={{width: '30%'}}>Mô tả</th> {/* Thêm cột mô tả */}
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
                            {/* Hiển thị mô tả */}
                            <td className="align-middle"><small>{r.description}</small></td>
                            <td className="align-middle text-success font-weight-bold">${r.price}</td>
                            <td className="align-middle">
                                <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditClick(r)}>Sửa</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Xóa</button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="6" className="text-center py-4">Chưa có phòng nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
};

export default Admin;