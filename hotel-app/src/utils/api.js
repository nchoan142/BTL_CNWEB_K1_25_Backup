// src/utils/api.js

export const initData = () => {
  const defaultUsers = [
      { username: 'admin', password: '123', role: 'admin' },
      { username: 'user', password: '123', role: 'user' }
  ];
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  const defaultRooms = [
      { 
          id: 1,
          name: 'Deluxe Sea View', 
          price: 300, 
          image: 'https://images.trvl-media.com/lodging/38000000/37430000/37422100/37422063/134275cd.jpg?impolicy=fcrop&w=1200&h=800&quality=medium',
          description: 'Phòng hướng biển tuyệt đẹp với ban công rộng, bồn tắm nằm và giường King size cao cấp.' 
      },
      { 
          id: 2,
          name: 'Family Suite', 
          price: 500, 
          image: 'https://image-tc.galaxy.tf/wijpeg-aqolumwjs8hakl6ryslaxcb3s/family-suite-3-2023_standard.jpg?crop=112%2C0%2C1777%2C1333', 
          description: 'Căn hộ 2 phòng ngủ rộng rãi, phù hợp cho gia đình 4 người, có bếp riêng và phòng khách.' 
      },
      { 
          id: 3, 
          name: 'Cozy Single Room', 
          price: 150, 
          image: 'https://hotelvilnia.lt/wp-content/uploads/2018/06/DSC07685-HDR-Edit-Edit.jpg', 
          description: 'Không gian ấm cúng, yên tĩnh, đầy đủ tiện nghi cho khách đi công tác hoặc du lịch một mình.' 
      }
  ];
  localStorage.setItem('rooms', JSON.stringify(defaultRooms));
  localStorage.setItem('bookings', JSON.stringify([]));
};

export const authService = {
  login: (username, password) => {
      const users = JSON.parse(localStorage.getItem('users'));
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return { success: true, user };
      }
      return { success: false };
  },
  logout: () => {
      localStorage.removeItem('currentUser');
      window.location.reload(); 
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
};

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