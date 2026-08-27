import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { MySqlStudentRepository } from '../repositories/mysql-student.repository';
import { MongoStudentRepository } from '../repositories/mongo-student.repository';
import { ApiResponse } from '../interfaces/api-response.interface';

export class StudentController {
  private studentService: StudentService;

  constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  public createStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { rollNumber, email, fullName, phone } = req.body;

      // Validate sơ bộ dữ liệu đầu vào (Request Validation)
      if (!rollNumber || !email || !fullName || !phone) {
        const errorResponse: ApiResponse = {
          success: false,
          message: 'Dữ liệu không hợp lệ. Vui lòng cung cấp đầy đủ thông tin.',
          errors: 'Missing required fields: rollNumber, email, fullName, phone'
        };
        return res.status(400).json(errorResponse);
      }

      // Xử lý nghiệp vụ tại Service
      const newStudent = await this.studentService.createStudent({
        rollNumber,
        email,
        fullName,
        phone
      });

      // Trả về cấu trúc thành công tiêu chuẩn
      const successResponse: ApiResponse = {
        success: true,
        message: 'Tạo sinh viên mới thành công.',
        data: newStudent
      };
      return res.status(201).json(successResponse);
    } catch (error: any) {
      // Trả về cấu trúc lỗi nghiệp vụ tiêu chuẩn
      const errorResponse: ApiResponse = {
        success: false,
        message: error.message || 'Xảy ra lỗi trong quá trình tạo sinh viên.',
        errors: error.stack
      };
      return res.status(400).json(errorResponse);
    }
  };

  /**
   * API Handler: Lấy danh sách toàn bộ sinh viên
   * GET /api/v1/students
   */
  public getAllStudents = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const students = await this.studentService.getAllStudents();

      const successResponse: ApiResponse = {
        success: true,
        message: 'Lấy danh sách sinh viên thành công.',
        total: students.length,
        data: students
      };
      return res.status(200).json(successResponse);
    } catch (error: any) {
      const errorResponse: ApiResponse = {
        success: false,
        message: error.message || 'Lỗi hệ thống khi lấy danh sách sinh viên.',
        errors: error.stack
      };
      return res.status(500).json(errorResponse);
    }
  };

  public updateStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const rollNumber = Array.isArray(req.params.rollNumber)
        ? req.params.rollNumber[0]
        : req.params.rollNumber;
      const updatedStudent = await this.studentService.updateStudent(rollNumber, req.body);

      const successResponse: ApiResponse = {
        success: true,
        message: 'Cập nhật sinh viên thành công.',
        data: updatedStudent
      };
      return res.status(200).json(successResponse);
    } catch (error: any) {
      const errorResponse: ApiResponse = {
        success: false,
        message: error.message || 'Lỗi hệ thống khi cập nhật sinh viên.',
        errors: error.stack
      };
      return res.status(400).json(errorResponse);
    }
  };

  public deleteStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const rollNumber = Array.isArray(req.params.rollNumber)
        ? req.params.rollNumber[0]
        : req.params.rollNumber;
      await this.studentService.deleteStudent(rollNumber);

      const successResponse: ApiResponse = {
        success: true,
        message: 'Xóa sinh viên thành công.'
      };
      return res.status(200).json(successResponse);
    } catch (error: any) {
      const errorResponse: ApiResponse = {
        success: false,
        message: error.message || 'Lỗi hệ thống khi xóa sinh viên.',
        errors: error.stack
      };
      return res.status(400).json(errorResponse);
    }
  };
}