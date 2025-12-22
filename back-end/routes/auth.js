// Quản lý đăng nhập, đăng ký

// Express giúp tạo Server và định nghĩa các Route
// Các Routers đóng vai trò là Controller trong MVC
const express = require('express');
const router = express.Router();
// Kết nối database
const db = require('../config/db');

// Đăng ký (URL: /api/auth/register)
router.post('/register', async (req, res) => {
    // const { username, password, full_name, email, phone } = req.body
    // Lấy dữ liệu từ Front-end
    // Sử dụng destructuring để lấy các trường cần thiết
    const { username, password, full_name, email, phone } = req.body;
    try {
        const sql = `INSERT INTO users (username, password, full_name, email, phone) VALUES (?, ?, ?, ?, ?)`;
        // db.query(sql, [username, password, full_name, email, phone])
        // Thực thi câu lệnh SQL với các giá trị tương ứng
        // Có bao nhiêu dấu ? thì truyền bấy nhiêu giá trị trong mảng
        await db.query(sql, [username, password, full_name, email, phone]); // Sử dụng promise/ async-await
        res.status(201).json({ success: true, message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Username hoặc Email đã tồn tại" });
    }
});

// Đăng nhập (URL: /api/auth/login)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const [rows] = await db.query(sql, [username, password]);

        if (rows.length > 0) {
            const user = rows[0];
            res.json({ 
                success: true, 
                user: { id: user.id, username: user.username, role: 'user' }
            });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;