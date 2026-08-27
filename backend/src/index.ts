import express, { Application } from 'express'; // Import Express Framework
import cors,{ CorsOptions } from 'cors'; // Import Middleware CORS
import dotenv from 'dotenv'; // Import dotenv
import studentRouter from './routes/student.route'; // Import Router của Student

// Nạp biến môi trường từ .env
dotenv.config();

// Khởi tạo Express Application
const app: Application = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173', // Địa chỉ mặc định của Client Vite/React
  'http://localhost:3000'  // Địa chỉ nội bộ
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Cho phép các Request không có Origin (như Postman hoặc Server-to-Server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Access denied from this Origin.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các HTTP Method được phép
  allowedHeaders: ['Content-Type', 'Authorization'],    // Các Header được phép gửi lên
  credentials: true // Cho phép gửi kèm Cookie/Authorization Header nếu cần
};

// Sử dụng các Middlewares toàn cục
app.use(cors(corsOptions));
app.use(express.json()); // Middleware parse dữ liệu JSON từ req.body
app.use(express.urlencoded({ extended: true })); // Middleware parse dữ liệu URL-encoded

// Đăng ký Router chính với tiền tố API
app.use('/api/v1/students', studentRouter);

// Khởi chạy Server Node.js
app.listen(PORT, () => {
  console.log(`[Backend] Server running at: http://localhost:${PORT}`);
});