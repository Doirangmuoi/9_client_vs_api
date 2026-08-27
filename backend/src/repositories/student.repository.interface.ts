import { Student } from '../models/student.model';

/**
 * TÍNH TRỪU TƯỢNG (ABSTRACTION):
 * Interface này đóng vai trò như một "mặt nạ" trừu tượng.
 * Nó định nghĩa các thao tác dữ liệu cần có mà KHÔNG hề chứa bất kỳ dòng mã xử lý SQL hay MongoDB nào.
 */
export interface StudentRepositoryInterface {
  /**
   * Phương thức lưu sinh viên mới
   * @param student Đối tượng sinh viên cần lưu
   */
  create(student: Student): Promise<Student>;

  /**
   * Phương thức lấy tất cả sinh viên
   */
  findAll(): Promise<Student[]>;

  /**
   * Phương thức tìm sinh viên theo email
   * @param email Email cần tìm
   */
  findByEmail(email: string): Promise<Student | null>;

  /**
   * Phương thức cập nhật thông tin sinh viên
   * @param rollNumber Mã số sinh viên cần cập nhật
   * @param data Dữ liệu cần thay đổi
   */
  update(rollNumber: string, data: Partial<Student>): Promise<Student | null>;
  delete(rollNumber : string) : Promise<boolean>; 
}