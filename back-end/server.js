const express = require('express');
const cors = require('cors');

// Gọi các file route vừa tạo
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- CẤU HÌNH ĐƯỜNG DẪN (ROUTING) ---

// 1. Nhóm Auth: Đường dẫn sẽ là /api/auth/register, /api/auth/login
app.use('/api/auth', authRoutes);

// 2. Nhóm Rooms: Đường dẫn sẽ là /api/rooms
app.use('/api/rooms', roomRoutes);

// 3. Nhóm Bookings: Đường dẫn sẽ là /api/bookings
app.use('/api/bookings', bookingRoutes);


app.get('/', (req, res) => {
    res.send("Backend Hotel App đang chạy với cấu trúc Router!");
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});