import { Student } from '../models/student.model';
import { StudentRepositoryInterface } from '../repositories/student.repository.interface';

export class StudentService {
  /**
   * KỸ THUẬT DEPENDENCY INJECTION (Tiêm phụ thuộc):
   * Service không tự tạo `new MySqlStudentRepository()`
   * Thay vào đó, nó nhận vào bất kỳ Repository nào tuân thủ `StudentRepositoryInterface`.
   */
  constructor(private studentRepository: StudentRepositoryInterface) {}

  public async createStudent(studentData: Student): Promise<Student> {
    // 1. Kiểm tra trùng lặp (Cách gọi hoàn toàn không đổi dù là DB nào!)
    const existingStudent = await this.studentRepository.findByEmail(studentData.email);
    if (existingStudent) {
      throw new Error('Email này đã tồn tại trong hệ thống!');
    }

    // 2. Chuẩn hóa dữ liệu
    const normalizedStudent = new Student(
      studentData.rollNumber.trim().toUpperCase(),
      studentData.email.trim().toLowerCase(),
      studentData.fullName.trim(),
      studentData.phone.trim()
    );

    // 3. Lệnh lưu đa hình
    return await this.studentRepository.create(normalizedStudent);
  }

  public async getAllStudents(): Promise<Student[]> {
    return await this.studentRepository.findAll();
  }

  public async updateStudent(rollNumber: string, data: Partial<Student>): Promise<Student> {
  // Validate trước khi động vào DB — đây là chỗ "logic nghiệp vụ" sống
  if (data.email) {
    const existing = await this.studentRepository.findByEmail(data.email);
    if (existing && existing.rollNumber !== rollNumber) {
      throw new Error('Email này đã được sinh viên khác sử dụng!');
    }
  }

  const updated = await this.studentRepository.update(rollNumber, data);
  if (!updated) throw new Error('Không tìm thấy sinh viên để cập nhật!');
  return updated;
 }

  public async deleteStudent(rollNumber: string): Promise<void> {
    const deleted = await this.studentRepository.delete(rollNumber);
    if (!deleted) throw new Error('Không tìm thấy sinh viên để xóa!');
 }
}