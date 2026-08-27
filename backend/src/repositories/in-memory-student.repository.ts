import { Student } from '../models/student.model';
import { StudentRepositoryInterface } from './student.repository.interface';

/**
 * TÍNH ĐA HÌNH (POLYMORPHISM) - HÌNH THÁI 3:
 * Class này thực thi interface lưu dữ liệu trực tiếp trong bộ nhớ RAM (In-Memory).
 * Thường dùng trong các trường hợp:
 * 1. Chạy Unit Test nhanh mà không cần cài đặt CSDL thật.
 * 2. Làm Demo/Prototype ứng dụng ban đầu.
 */
export class InMemoryStudentRepository implements StudentRepositoryInterface {
  // Mảng lưu dữ liệu giả lập trong RAM
  private studentsInMemory: Student[] = [];

  public async create(student: Student): Promise<Student> {
    console.log('[In-Memory] ─── Pushing to RAM Array...');
    this.studentsInMemory.push(student);
    return student;
  }

  public async findAll(): Promise<Student[]> {
    console.log('[In-Memory] ─── Fetching all from RAM Array...');
    // Trả về bản sao của mảng
    return [...this.studentsInMemory];
  }

  public async findByEmail(email: string): Promise<Student | null> {
    console.log(`[In-Memory] ─── Filtering RAM Array by email: '${email}'...`);
    const student = this.studentsInMemory.find(s => s.email === email);
    return student || null;
  }

  public async update(rollNumber: string, data: Partial<Student>): Promise<Student | null> {
    console.log('[In-Memory] ─── Updating RAM Array...');
    const index = this.studentsInMemory.findIndex(s => s.rollNumber === rollNumber);
    if (index === -1) return null;

    this.studentsInMemory[index] = { ...this.studentsInMemory[index], ...data };
    return this.studentsInMemory[index];
 }

  public async delete(rollNumber: string): Promise<boolean> {
    console.log('[In-Memory] ─── Removing from RAM Array...');
    const before = this.studentsInMemory.length;
    this.studentsInMemory = this.studentsInMemory.filter(s => s.rollNumber !== rollNumber);
    return this.studentsInMemory.length < before;
 }
}