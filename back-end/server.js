const express = require('express');
const cors = require('cors');

// Gọi các file route vừa tạo
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const roomTypeRoutes = require('./routes/roomTypes');

const app = express(); // Server Express
const port = 3000;

app.use(cors()); // cho phép front-end truy cập API từ back-end
app.use(express.json()); // phải có dòng này mới sử dụng được req.body

// Auth: Đường dẫn là /api/auth/register, /api/auth/login
app.use('/api/auth', authRoutes);

// Rooms: Đường dẫn là /api/rooms
app.use('/api/rooms', roomRoutes);

// Bookings: Đường dẫn là /api/bookings
app.use('/api/bookings', bookingRoutes);

// Room Types: Đường dẫn là /api/room-types
app.use('/api/room-types', roomTypeRoutes);


// Tham số thứ 1: đường dẫn gốc (http://localhost:3000/)
// Tham số thứ 2: hàm xử lý khi có request đến đường dẫn này
// req: request (yêu cầu từ client)
// res: response (phản hồi từ server)
app.get('/', (req, res) => {
    res.send("Backend Hotel App đang chạy với cấu trúc Router!");
    console.log("Có request đến");
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});