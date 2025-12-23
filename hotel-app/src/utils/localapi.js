// Đang dùng localStorage không phải API back-end
// src/utils/api.js


// src/utils/api.js
// ... (các phần initData và authService giữ nguyên)

export const roomService = {
  getAll: () => JSON.parse(localStorage.getItem('rooms') || '[]'),
  
  add: (room) => {
      const rooms = roomService.getAll();
      const maxId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) : 0;
      const newRoom = { ...room, id: maxId + 1 };
      rooms.push(newRoom);
      localStorage.setItem('rooms', JSON.stringify(rooms));
      return rooms;
  },

  // --- THÊM HÀM NÀY VÀO ---
  update: (id, updatedData) => {
      let rooms = roomService.getAll();
      const index = rooms.findIndex(r => r.id === id);
      if (index !== -1) {
          // Giữ nguyên ID, chỉ thay đổi thông tin khác
          rooms[index] = { ...rooms[index], ...updatedData };
          localStorage.setItem('rooms', JSON.stringify(rooms));
      }
      return rooms;
  },
  // ------------------------
  
  delete: (id) => {
      let rooms = roomService.getAll();
      rooms = rooms.filter(r => r.id !== id);
      localStorage.setItem('rooms', JSON.stringify(rooms));
      return rooms;
  }
};

// ... (bookingService giữ nguyên)

// src/utils/api.js

export const bookingService = {
  // 1. Sửa hàm book để trả về toàn bộ object booking (có ID)
  book: (bookingInfo) => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const newBooking = {
          id: Date.now(),
          status: 'Unpaid', // Mặc định là chưa thanh toán
          date: new Date().toLocaleDateString(),
          ...bookingInfo
      };

      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Trả về object booking để lấy ID chuyển trang
      return { success: true, booking: newBooking }; 
  },

  // 2. Thêm hàm cập nhật trạng thái sau khi thanh toán
  updateStatus: (bookingId, status, paymentMethod, finalPrice) => {
      let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const index = bookings.findIndex(b => b.id == bookingId);
      
      if (index !== -1) {
          bookings[index].status = status; // 'Paid' hoặc 'Pay at Hotel'
          bookings[index].paymentMethod = paymentMethod;
          bookings[index].finalPrice = finalPrice;
          localStorage.setItem('bookings', JSON.stringify(bookings));
      }
  },
  getHistory: (username) => {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        // Lọc những đơn có username trùng với người đang đăng nhập
        return bookings.filter(b => b.username === username);
    },
  getById: (id) => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      return bookings.find(b => b.id == id);
  },
  getAll: () => {
      return JSON.parse(localStorage.getItem('bookings') || '[]');
  },

  // 2. THÊM HÀM XÓA BOOKING
  delete: (id) => {
      let bookings = bookingService.getAll();
      bookings = bookings.filter(b => b.id !== id);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      return bookings;
  }
};