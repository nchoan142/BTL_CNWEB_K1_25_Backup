// src/utils/api.js
const API_URL = "http://localhost:3000/api";

// --- QUẢN LÝ TÀI KHOẢN (AUTH) ---
export const authService = {
    // 1. Đăng ký
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi kết nối server" };
        }
    },

    // 2. Đăng nhập
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return { success: false, error: "Lỗi kết nối server" };
        }
    },

    // 3. Đăng xuất
    logout: () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/login'; 
    },

    // 4. Lấy user hiện tại (Để Header hiển thị tên)
    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
};

// --- BỔ SUNG: QUẢN LÝ PHÒNG (ROOMS) ---
export const roomService = {
    // 1. Lấy danh sách (READ)
    getAll: async () => {
        try {
            // Gọi vào endpoint /room-types vì đây là bảng bạn đang quản lý
            const response = await fetch(`${API_URL}/room-types`);
            return response.json();
        } catch (error) {
            return [];
        }
    },

    getById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/room-types/${id}`);
            return response.json();
        } catch (error) { return null; }
    },

    // 2. Thêm mới (CREATE)
    create: async (roomData) => {
        try {
            const response = await fetch(`${API_URL}/room-types`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(roomData),
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi kết nối" };
        }
    },

    // 3. Cập nhật (UPDATE) - Đây là cái bạn đang cần
    update: async (id, roomData) => {
        try {
            const response = await fetch(`${API_URL}/room-types/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(roomData),
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi kết nối" };
        }
    },

    // 4. Xóa (DELETE)
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/room-types/${id}`, {
                method: "DELETE",
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi kết nối" };
        }
    }
};

// src/utils/api.js

// --- BỔ SUNG: QUẢN LÝ ĐẶT PHÒNG ---
export const bookingService = {
    // 1. Lấy danh sách tất cả đơn đặt (Dùng cho Admin) -> BỔ SUNG HÀM NÀY
    getAll: async () => {
        try {
            const response = await fetch(`${API_URL}/bookings`);
            return response.json();
        } catch (error) {
            return [];
        }
    },

    // 2. Tạo đơn mới
    create: async (bookingData) => {
        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi kết nối" };
        }
    },

    // 3. Lấy chi tiết
    getById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/bookings/${id}`);
            return response.json();
        } catch (error) {
            return null;
        }
    },

    // 4. Cập nhật trạng thái
    updateStatus: async (id, status, paymentMethod) => {
        try {
            const response = await fetch(`${API_URL}/bookings/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, paymentMethod }),
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi kết nối" };
        }
    },

    // 5. Xóa đơn đặt (Admin) -> BỔ SUNG HÀM NÀY
    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/bookings/${id}`, {
                method: "DELETE",
            });
            return response.json();
        } catch (error) {
            return { success: false, error: "Lỗi xóa đơn" };
        }
    },

    getHistory: async (userId) => {
        try {
            // Gọi vào endpoint router.get('/my-bookings/:userId') bên backend
            const response = await fetch(`${API_URL}/bookings/my-bookings/${userId}`);
            return response.json();
        } catch (error) {
            console.error("Lỗi lấy lịch sử:", error);
            return [];
        }
    }
};