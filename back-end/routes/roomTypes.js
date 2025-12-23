const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. THÊM LOẠI PHÒNG (Create) ---
// URL: POST http://localhost:3000/api/room-types
router.post('/', async (req, res) => {
    const { type, price, description, adult, children, image } = req.body;

    // Validate dữ liệu cơ bản
    if (!type || !price) {
        return res.status(400).json({ success: false, message: "Tên và giá là bắt buộc!" });
    }

    try {
        const sql = `
            INSERT INTO room_types (type, price, description, adult, children, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [type, price, description, adult, children, image]);

        res.status(201).json({ 
            success: true, 
            message: "Thêm loại phòng thành công!", 
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 2. SỬA LOẠI PHÒNG (Update) ---
// URL: PUT http://localhost:3000/api/room-types/:id
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { type, price, description, adult, children, image } = req.body;

    try {
        // Kiểm tra xem ID này có tồn tại không trước khi sửa
        const [check] = await db.query('SELECT * FROM room_types WHERE id = ?', [id]);
        if (check.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy loại phòng này" });
        }

        const sql = `
            UPDATE room_types 
            SET type = ?, price = ?, description = ?, adult = ?, children = ?, image = ?
            WHERE id = ?
        `;
        await db.query(sql, [type, price, description, adult, children, image, id]);

        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 3. XÓA LOẠI PHÒNG (Delete) ---
// URL: DELETE http://localhost:3000/api/room-types/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // [Rất quan trọng] Kiểm tra ràng buộc khóa ngoại
        // Nếu bảng 'rooms' đang có phòng dùng loại này (room_types_id) thì KHÔNG ĐƯỢC XÓA
        const [roomsUsingThisType] = await db.query('SELECT * FROM rooms WHERE room_types_id = ?', [id]);
        
        if (roomsUsingThisType.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Không thể xóa! Đang có các phòng (101, 102...) thuộc loại này. Hãy xóa các phòng đó trước." 
            });
        }

        const sql = `DELETE FROM room_types WHERE id = ?`;
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ID để xóa" });
        }

        res.json({ success: true, message: "Đã xóa thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 4. LẤY DANH SÁCH (Read) ---
// URL: GET http://localhost:3000/api/room-types
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM room_types');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 5. LẤY CHI TIẾT 1 LOẠI (Để hiển thị lên form sửa) ---
// URL: GET http://localhost:3000/api/room-types/:id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM room_types WHERE id = ?', [req.params.id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ message: "Không tìm thấy" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;