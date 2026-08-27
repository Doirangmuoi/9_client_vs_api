import dbPool from '../config/database'; // Import dbPool từ file cấu hình CSDL
import { Student } from '../models/student.model'; // Import Lớp Student
import { ResultSetHeader, RowDataPacket } from 'mysql2'; // Import kiểu dữ liệu của mysql2

export class StudentRepository {
  /**
   * Chức năng: Lưu một sinh viên mới vào CSDL MySQL
   * @param student Đối tượng sinh viên cần lưu
   */
  public async create(student: Student): Promise<Student> {
    // Câu lệnh SQL thêm sinh viên mới
    const sql = `
      INSERT INTO students (roll_number, email, full_name, phone)
      VALUES (?, ?, ?, ?)
    `;

    // Mảng tham số tương ứng với dấu hỏi chấm ? để tránh lỗi SQL Injection
    const values = [student.rollNumber, student.email, student.fullName, student.phone];

    // Thực thi câu lệnh SQL qua Pool
    await dbPool.execute<ResultSetHeader>(sql, values);

    // Trả về chính đối tượng sinh viên vừa tạo
    return student;
  }

  /**
   * Chức năng: Lấy danh sách toàn bộ sinh viên từ CSDL
   */
  public async findAll(): Promise<Student[]> {
    // Câu lệnh SQL lấy tất cả sinh viên
    const sql = `SELECT roll_number AS rollNumber, email, full_name AS fullName, phone FROM students`;

    // Thực thi câu lệnh SQL SELECT
    const [rows] = await dbPool.query<RowDataPacket[]>(sql);

    // Ép kiểu kết quả trả về thành mảng các đối tượng Student
    return rows as Student[];
  }

  /**
   * Chức năng: Tìm sinh viên theo Email (Phục vụ logic kiểm tra trùng lặp ở tầng Service)
   */
  public async findByEmail(email: string): Promise<Student | null> {
    const sql = `SELECT roll_number AS rollNumber, email, full_name AS fullName, phone FROM students WHERE email = ?`;
    const [rows] = await dbPool.query<RowDataPacket[]>(sql, [email]);

    if (rows.length === 0) {
      return null; // Không tìm thấy
    }

    return rows[0] as Student;
  }
}