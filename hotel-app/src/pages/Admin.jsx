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

  const loadData = async () => {
      try {
          const data = await roomService.getAll();
          // Kiểm tra an toàn: Nếu data là mảng thì mới set, không thì set rỗng
          setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
          setRooms([]);
      }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    // --- SỬA ĐOẠN NÀY ---
    // Cũ: if (!user || user.role !== 'admin')
    // Mới: Kiểm tra nếu không phải user "admin" thì đuổi về
    if (!user || user.username !== 'admin') { 
      toast.error("Bạn không có quyền truy cập trang quản trị!");
      navigate('/login');
    } else {
      loadData(); 
    }
    // --------------------

}, [navigate]);

  const handleSubmit = async () => {
    // 1. Validate
    if(!form.name || !form.price || !form.image) {
        return toast.warning("Vui lòng điền tên, giá và ảnh!");
    }

    // 2. Chuẩn bị payload
    const payload = {
        type: form.name, // Mapping: Form dùng 'name', nhưng DB cần 'type'
        price: form.price,
        description: form.description,
        image: form.image,
        adult: 2,    // Mặc định
        children: 1  // Mặc định
    };

    let result;
    
    // 3. Gọi API
    if (isEditing) {
        // --- LOGIC SỬA ---
        result = await roomService.update(editId, payload);
        if (result.success) {
            toast.success("Cập nhật thành công!");
            handleCancel(); // Reset form sau khi sửa xong
        } else {
            toast.error("Lỗi: " + (result.message || "Cập nhật thất bại"));
        }
    } else {
        // --- LOGIC THÊM MỚI ---
        result = await roomService.create(payload);
        if (result.success) {
            toast.success("Thêm phòng mới thành công!");
            // Reset form về mặc định
            setForm({ name: '', price: '', image: '/img/bg-img/bg-1.jpg', description: '' });
        } else {
            toast.error("Lỗi: " + (result.error || result.message));
        }
    }

    // 4. Load lại dữ liệu
    if (result.success) {
        loadData(); 
    }
  };

  const handleEditClick = (room) => {
      // Mapping ngược: Lấy 'type' từ DB đổ vào 'name' của Form
      setForm({ 
          name: room.type, 
          price: room.price, 
          image: room.image, 
          description: room.description 
      });
      setIsEditing(true);
      setEditId(room.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setIsEditing(false);
      setEditId(null);
      setForm({ name: '', price: '', image: '/img/bg-img/bg-1.jpg', description: '' });
  };

  const handleDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <h6 className="mb-2 text-dark">Xác nhận xóa?</h6>
          <p className="mb-3 text-muted" style={{fontSize: '13px'}}>
            Không thể hoàn tác hành động này.
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary btn-sm mr-2" onClick={closeToast}>Hủy</button>
            <button 
                className="btn btn-danger btn-sm" 
                onClick={async () => {
                    const result = await roomService.delete(id);
                    if (result.success) {
                        toast.dismiss();
                        toast.success("Đã xóa thành công!");
                        loadData(); 
                    } else {
                        toast.dismiss();
                        toast.error(result.message || "Không thể xóa (đang có người đặt phòng này?)");
                    }
                }}
            >
                Xóa ngay
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        style: { minWidth: '300px' }
      }
    );
  };

  return (
    <>
      <Header />
      <div className="container" style={{marginTop: '150px', marginBottom: '100px'}}>
        <h2 className="mb-4 text-center text-lobster" style={{color: '#736de9ff', fontSize: '50px' }}>
            Quản lý loại phòng
        </h2>
        
        <div className="card shadow-lg border-0">
            <div className="card-body p-4">

                {/* --- FORM --- */}
                <div 
                    className="p-3 mb-4 rounded" 
                    style={{
                        backgroundColor: isEditing ? '#fff3cd' : '#f8f9fa', 
                        border: isEditing ? '1px solid #ffeeba' : '1px dashed #ced4da'
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0" style={{color: isEditing ? '#856404' : '#333'}}>
                            {isEditing ? `✏️ Đang sửa ID: ${editId}` : '➕ Thêm loại phòng mới'}
                        </h4>
                        {isEditing && <button className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>Hủy bỏ</button>}
                    </div>
                    
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label>Tên loại phòng <span className="text-danger">*</span></label>
                            <input className="form-control" placeholder="Ví dụ: Deluxe Room" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </div>
                        
                        <div className="col-md-2 mb-2">
                            <label>Giá ($) <span className="text-danger">*</span></label>
                            <input className="form-control" type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                        </div>

                        <div className="col-md-7 mb-2">
                            <label>Link ảnh</label>
                            <input className="form-control" type="text" placeholder="/img/bg-img/..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label>Mô tả phòng</label>
                            <textarea 
                                className="form-control" 
                                rows="2" 
                                placeholder="Nhập mô tả chi tiết..." 
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

                <hr className="my-4" />

                {/* --- TABLE --- */}
                <h4 className="mb-3">Danh sách hiện có</h4>
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
                                    {/* SỬA QUAN TRỌNG: r.type thay vì r.name */}
                                    <td className="align-middle font-weight-bold" style={{color: '#736de9ff'}}>{r.type}</td>
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
                                <tr><td colSpan="6" className="text-center py-4">Chưa có dữ liệu phòng.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
      </div>
    </>
  );
};

export default Admin;