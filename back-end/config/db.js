// server/config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',        // Điền password MySQL của bạn (nếu có)
    database: 'hotel_db' // Tên database bạn đã tạo
});

module.exports = pool.promise();