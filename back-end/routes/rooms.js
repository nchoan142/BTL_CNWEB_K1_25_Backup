// Quản lý phòng
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách phòng (URL: /api/rooms)
// Lưu ý: Chỉ để dấu / vì bên server.js ta sẽ định nghĩa /api/rooms rồi
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT r.id, r.room_number, r.status, rt.type as type_name, rt.price, rt.description, rt.adult, rt.children
            FROM rooms r
            JOIN room_types rt ON r.room_types_id = rt.id
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy chi tiết 1 phòng (URL: /api/rooms/:id)
router.get('/:id', async (req, res) => {
    try {
        const roomId = req.params.id;
        const sql = `
            SELECT r.*, rt.type, rt.price, rt.description 
            FROM rooms r
            JOIN room_types rt ON r.room_types_id = rt.id
            WHERE r.id = ?
        `;
        const [rows] = await db.query(sql, [roomId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ message: "Không tìm thấy phòng" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// api xóa dữ liệu trong bảng room_types (URL: /api/rooms/:id)
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Kiểm tra xem có phòng nào đang dùng loại phòng này không?
        // Nếu có thì KHÔNG ĐƯỢC XÓA (để tránh lỗi database)
        const [check] = await db.query('SELECT * FROM rooms WHERE room_types_id = ?', [id]);
        if (check.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Không thể xóa! Đang có phòng thuộc loại này." 
            });
        }

        // Nếu không có phòng nào dùng thì mới xóa
        const sql = `DELETE FROM room_types WHERE id = ?`;
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy ID loại phòng này" });
        }

        res.json({ success: true, message: "Đã xóa loại phòng thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
module.exports = router;