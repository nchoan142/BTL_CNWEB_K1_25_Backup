const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 1. LẤY DANH SÁCH ĐƠN ĐẶT (Dành cho Admin) ---
// URL: GET http://localhost:3000/api/bookings
router.get('/', async (req, res) => {
    try {
        // Sử dụng JOIN để lấy tên phòng và loại phòng thay vì chỉ hiện ID số
        const sql = `
            SELECT b.*, r.room_number, rt.type as room_type
            FROM bookings b
            JOIN rooms r ON b.rooms_id = r.id
            JOIN room_types rt ON r.room_types_id = rt.id
            ORDER BY b.id DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 2. TẠO ĐƠN ĐẶT PHÒNG MỚI (Create) ---
// URL: POST http://localhost:3000/api/bookings
router.post('/', async (req, res) => {
    // Lấy đầy đủ dữ liệu từ form đặt phòng
    const { 
        users_id, rooms_id, 
        check_in_date, check_out_date, 
        total_price, people_count, room_count,
        guest_name, guest_phone, guest_email, guest_requests 
    } = req.body;

    // Mặc định trạng thái khi mới đặt là 'Pending' hoặc 'Unpaid'
    const status = 'Pending';
    const paymentMethod = 'Pay at Hotel'; // Hoặc lấy từ req.body nếu có chọn

    try {
        const sql = `
            INSERT INTO bookings 
            (
                users_id, 
                rooms_id, 
                check_in_date, 
                check_out_date, 
                total_price, 
                status, 
                paymentMethod, 
                people_count, 
                room_count, 
                guest_name, 
                guest_phone, 
                guest_email, 
                guest_requests
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(sql, [
            users_id, rooms_id, 
            check_in_date, check_out_date, 
            total_price, status, paymentMethod, 
            people_count, room_count, 
            guest_name, guest_phone, guest_email, guest_requests
        ]);

        // Sau khi đặt xong -> Cập nhật trạng thái phòng thành 'booked'
        await db.query(`UPDATE rooms SET status = 'booked' WHERE id = ?`, [rooms_id]);

        res.status(201).json({ 
            success: true, 
            message: "Đặt phòng thành công!", 
            bookingId: result.insertId 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 3. CẬP NHẬT TRẠNG THÁI ĐƠN (Update) ---
// URL: PUT http://localhost:3000/api/bookings/:id
// Dùng khi Admin xác nhận thanh toán hoặc khách đổi ý
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { status, paymentMethod } = req.body; // Thường chỉ update trạng thái

    try {
        const sql = `UPDATE bookings SET status = ?, paymentMethod = ? WHERE id = ?`;
        const [result] = await db.query(sql, [status, paymentMethod, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng này" });
        }

        // Logic phụ: Nếu Admin chuyển trạng thái thành 'Cancelled' (Hủy),
        // thì phải trả lại trạng thái 'available' cho phòng.
        if (status === 'Cancelled') {
            // 1. Tìm xem đơn này đặt phòng nào
            const [booking] = await db.query('SELECT rooms_id FROM bookings WHERE id = ?', [id]);
            if (booking.length > 0) {
                // 2. Nhả phòng ra
                await db.query(`UPDATE rooms SET status = 'available' WHERE id = ?`, [booking[0].rooms_id]);
            }
        }

        res.json({ success: true, message: "Cập nhật đơn hàng thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 4. XÓA ĐƠN ĐẶT PHÒNG (Delete) ---
// URL: DELETE http://localhost:3000/api/bookings/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Bước 1: Lấy ID phòng của đơn này trước khi xóa
        // Để sau khi xóa đơn, ta set lại phòng đó thành 'available' (trống)
        const [rows] = await db.query('SELECT rooms_id FROM bookings WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Đơn đặt phòng không tồn tại" });
        }
        
        const roomId = rows[0].rooms_id;

        // Bước 2: Xóa đơn trong bảng bookings
        await db.query('DELETE FROM bookings WHERE id = ?', [id]);

        // Bước 3: Cập nhật lại phòng thành 'available' (cho khách khác đặt)
        await db.query("UPDATE rooms SET status = 'available' WHERE id = ?", [roomId]);

        res.json({ success: true, message: "Đã xóa đơn và hoàn trả phòng trống." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 5. LẤY LỊCH SỬ CỦA USER (Giữ nguyên code cũ của bạn) ---
router.get('/my-bookings/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = `
            SELECT b.*, r.room_number, rt.type
            FROM bookings b
            JOIN rooms r ON b.rooms_id = r.id
            JOIN room_types rt ON r.room_types_id = rt.id
            WHERE b.users_id = ?
            ORDER BY b.check_in_date DESC
        `;
        const [rows] = await db.query(sql, [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- BỔ SUNG: Lấy chi tiết 1 đơn hàng (Dùng cho trang Payment) ---
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT b.*, r.room_number, rt.type as roomName
            FROM bookings b
            JOIN rooms r ON b.rooms_id = r.id
            JOIN room_types rt ON r.room_types_id = rt.id
            WHERE b.id = ?
        `;
        const [rows] = await db.query(sql, [req.params.id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- BỔ SUNG: Cập nhật trạng thái thanh toán ---
router.put('/:id', async (req, res) => {
    const { status, paymentMethod, total_price } = req.body;
    try {
        // Cập nhật trạng thái (Ví dụ: 'Paid') và phương thức thanh toán
        await db.query(
            `UPDATE bookings SET status = ?, paymentMethod = ? WHERE id = ?`, 
            [status, paymentMethod, req.params.id]
        );
        res.json({ success: true, message: "Thanh toán thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 6. LẤY CHI TIẾT 1 ĐƠN HÀNG (Dùng cho trang Payment) ---
// URL: GET http://localhost:3000/api/bookings/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Join 3 bảng để lấy tên loại phòng (room_type)
        const sql = `
            SELECT b.*, rt.type as room_type, rt.price as base_price
            FROM bookings b
            JOIN rooms r ON b.rooms_id = r.id
            JOIN room_types rt ON r.room_types_id = rt.id
            WHERE b.id = ?
        `;
        const [rows] = await db.query(sql, [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;