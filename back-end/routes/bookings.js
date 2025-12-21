// Quản lý đặt phòng (bookings)
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Tạo đơn đặt phòng (URL: /api/bookings)
router.post('/', async (req, res) => {
    const { users_id, rooms_id, check_in_date, check_out_date, total_price } = req.body;
    try {
        const sqlBooking = `INSERT INTO bookings (users_id, rooms_id, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sqlBooking, [users_id, rooms_id, check_in_date, check_out_date, total_price]);

        await db.query(`UPDATE rooms SET status = 'booked' WHERE id = ?`, [rooms_id]);

        res.status(201).json({ success: true, message: "Đặt phòng thành công!", bookingId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Xem lịch sử (URL: /api/bookings/my-bookings/:userId)
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

module.exports = router;