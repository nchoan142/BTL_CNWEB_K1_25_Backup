// js/logic.js

// --- 1. KHỞI TẠO DỮ LIỆU MẪU (DATABASE ẢO) ---
const initData = () => {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { username: 'admin', password: '123', role: 'admin' }, // Tài khoản Admin
            { username: 'user', password: '123', role: 'user' }    // Tài khoản User
        ]));
    }
    if (!localStorage.getItem('rooms')) {
        // Dữ liệu phòng mẫu lấy từ template của bạn
        localStorage.setItem('rooms', JSON.stringify([
            { id: 1, name: 'Deluxe Room', price: 150, image: 'img/bg-img/1.jpg' },
            { id: 2, name: 'Double Suite', price: 150, image: 'img/bg-img/8.jpg' },
            { id: 3, name: 'Single Room', price: 100, image: 'img/bg-img/9.jpg' }
        ]));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
};

// Gọi hàm khởi tạo khi chạy web
initData();

// --- 2. CHỨC NĂNG AUTHENTICATION (LOGIN/LOGOUT) ---
const auth = {
    login: (username, password) => {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, role: user.role };
        }
        return { success: false };
    },
    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('currentUser'));
    },
    checkAdmin: () => {
        const user = auth.getCurrentUser();
        if (!user || user.role !== 'admin') {
            alert("Bạn không có quyền truy cập trang này!");
            window.location.href = 'login.html';
        }
    }
};

// Cập nhật giao diện Header dựa trên trạng thái đăng nhập
const updateHeaderUI = () => {
    const user = auth.getCurrentUser();
    const navMenu = document.querySelector('.classynav ul');
    if (navMenu) {
        if (user) {
            // Nếu đã đăng nhập
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<a href="#" onclick="auth.logout()">Logout (${user.username})</a>`;
            navMenu.appendChild(logoutLi);
            
            if(user.role === 'admin') {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = `<a href="admin.html">Quản lý</a>`;
                navMenu.appendChild(adminLi);
            }
        } else {
            // Nếu chưa đăng nhập
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="login.html">Login</a>`;
            navMenu.appendChild(loginLi);
        }
    }
};

// --- 3. CHỨC NĂNG CRUD (QUẢN LÝ PHÒNG) ---
const roomManager = {
    getAll: () => JSON.parse(localStorage.getItem('rooms')),
    add: (room) => {
        const rooms = roomManager.getAll();
        room.id = Date.now(); // Tạo ID ngẫu nhiên
        rooms.push(room);
        localStorage.setItem('rooms', JSON.stringify(rooms));
    },
    delete: (id) => {
        let rooms = roomManager.getAll();
        rooms = rooms.filter(r => r.id != id);
        localStorage.setItem('rooms', JSON.stringify(rooms));
    },
    update: (id, newRoomData) => {
        let rooms = roomManager.getAll();
        const index = rooms.findIndex(r => r.id == id);
        if (index !== -1) {
            rooms[index] = { ...rooms[index], ...newRoomData };
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }
    }
};

// --- 4. CHỨC NĂNG BOOKING (ĐẶT PHÒNG) ---
const bookingManager = {
    book: (roomId, dateIn, dateOut) => {
        const user = auth.getCurrentUser();
        if (!user) {
            alert("Vui lòng đăng nhập để đặt phòng!");
            window.location.href = 'login.html';
            return;
        }
        const bookings = JSON.parse(localStorage.getItem('bookings'));
        bookings.push({
            id: Date.now(),
            user: user.username,
            roomId: roomId,
            checkIn: dateIn,
            checkOut: dateOut,
            status: 'Pending'
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        alert("Đặt phòng thành công!");
    }
};

// Tự động chạy cập nhật Header khi load trang
document.addEventListener('DOMContentLoaded', updateHeaderUI);