import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { roomService, authService } from '../utils/api';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  
  // State quản lý form
  const [form, setForm] = useState({ name: '', price: '', image: '/img/bg-img/1.jpg' });
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang sửa hay đang thêm
  const [editId, setEditId] = useState(null); // ID của phòng đang sửa

  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      alert("Chỉ Admin mới được vào!");
      navigate('/login');
    }
    setRooms(roomService.getAll());
  }, [navigate]);

  // Xử lý khi bấm nút "Thêm" hoặc "Lưu"
  const handleSubmit = () => {
    if(!form.name || !form.price || !form.image) return alert("Vui lòng điền đủ thông tin!");

    if (isEditing) {
        // --- LOGIC SỬA (UPDATE) ---
        const updatedRooms = roomService.update(editId, form);
        setRooms(updatedRooms);
        alert("Đã cập nhật phòng thành công!");
        setIsEditing(false); // Thoát chế độ sửa
        setEditId(null);
    } else {
        // --- LOGIC THÊM (CREATE) ---
        const updatedRooms = roomService.add(form);
        setRooms(updatedRooms);
        alert("Đã thêm phòng mới!");
    }

    // Reset form về mặc định
    setForm({ name: '', price: '', image: '/img/bg-img/1.jpg' });
  };

  // Xử lý khi bấm nút "Sửa" ở bảng
  const handleEditClick = (room) => {
      setForm(room); // Điền thông tin phòng cũ vào form
      setIsEditing(true); // Bật chế độ sửa
      setEditId(room.id);
      
      // Cuộn trang lên đầu để thấy form
      window.scrollTo(0, 0); 
  };

  // Xử lý nút "Hủy" (để không sửa nữa)
  const handleCancel = () => {
      setIsEditing(false);
      setEditId(null);
      setForm({ name: '', price: '', image: '/img/bg-img/1.jpg' });
  };

  const handleDelete = (id) => {
    if(window.confirm("Bạn chắc chắn muốn xóa phòng này?")) {
      const updatedRooms = roomService.delete(id);
      setRooms(updatedRooms);
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{marginTop: '150px', marginBottom: '100px'}}>
        <h2>Admin Dashboard (Quản lý phòng)</h2>
        
        {/* Form nhập liệu (Dùng chung cho Thêm và Sửa) */}
        <div className="row mt-30 p-4" style={{background: isEditing ? '#fff3cd' : '#f1f1f1', borderRadius: '5px', border: isEditing ? '1px solid #ffeeba' : 'none'}}>
            <div className="col-12 mb-3">
                <h4>{isEditing ? `Đang sửa phòng ID: ${editId}` : 'Thêm phòng mới'}</h4>
            </div>
            
            <div className="col-md-3 mb-2">
                <input 
                  className="form-control" 
                  placeholder="Tên phòng" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
            </div>
            
            <div className="col-md-2 mb-2">
                <input 
                  className="form-control" 
                  type="number" 
                  placeholder="Giá ($)" 
                  value={form.price} 
                  onChange={e => setForm({...form, price: e.target.value})} 
                />
            </div>

            <div className="col-md-5 mb-2">
                <input 
                  className="form-control" 
                  type="text" 
                  placeholder="Link ảnh" 
                  value={form.image} 
                  onChange={e => setForm({...form, image: e.target.value})} 
                />
            </div>

            <div className="col-md-2 mb-2 d-flex">
                <button className={`btn w-100 ${isEditing ? 'btn-warning' : 'palatin-btn'}`} onClick={handleSubmit}>
                    {isEditing ? 'Lưu Sửa' : 'Thêm'}
                </button>
                {isEditing && (
                    <button className="btn btn-secondary ml-2" onClick={handleCancel}>Hủy</button>
                )}
            </div>
             
             {/* Preview ảnh */}
            <div className="col-12 mt-2">
                 <img src={form.image} alt="Preview" style={{height: '60px', width: '100px', objectFit: 'cover', border: '1px solid #ccc'}} onError={(e) => e.target.src = 'https://via.placeholder.com/100x60'} />
            </div>
        </div>

        {/* Bảng Danh sách */}
        <table className="table mt-50 table-bordered table-hover">
            <thead style={{background: '#cb8670', color: 'white'}}>
                <tr>
                    <th>ID</th>
                    <th>Ảnh</th>
                    <th>Tên Phòng</th>
                    <th>Giá</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map(r => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>
                            <img src={r.image} style={{width: '80px', height: '50px', objectFit: 'cover'}} alt="" />
                        </td>
                        <td>{r.name}</td>
                        <td>${r.price}</td>
                        <td>
                            <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditClick(r)}>Sửa</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </>
  );
};

export default Admin;