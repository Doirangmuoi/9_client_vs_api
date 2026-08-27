// Import thư viện dotenv để đọc thông tin file .env
import dotenv from 'dotenv';
// Import thư viện mysql2 dạng promise để hỗ trợ async/await
import mysql from 'mysql2/promise';

// Khởi chạy dotenv để nạp các biến môi trường vào process.env
dotenv.config();

// Khởi tạo Connection Pool kết nối MySQL
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Địa chỉ host database
  user: process.env.DB_USER || 'root', // Tài khoản kết nối DB
  password: process.env.DB_PASSWORD || '', // Mật khẩu kết nối DB
  database: process.env.DB_NAME || 'school_db', // Tên CSDL
  port: Number(process.env.DB_PORT) || 3306, // Cổng kết nối DB
  waitForConnections: true, // Chờ nếu hết kết nối rảnh trong pool
  connectionLimit: 10, // Số lượng kết nối tối đa trong pool
  queueLimit: 0, // Không giới hạn hàng chờ kết nối
});

// Xuất dbPool để các tầng khác (Repository) tái sử dụng
export default dbPool;
