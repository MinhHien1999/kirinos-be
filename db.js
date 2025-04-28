// db.js
import mysql from 'mysql2/promise';

// Tạo kết nối dùng promise
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Minhhien1999',
  database: 'kirinos',
});

try {
  console.log('✅ Kết nối MySQL thành công!');
} catch (err) {
  console.error('❌ Lỗi kết nối MySQL:', err);
}

export default connection;
