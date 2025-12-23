// db.js chưasp nối đến database MySQL
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',        
    database: 'hotel_db', // Tên database đã tạo
    port: 3306
});

module.exports = pool.promise();