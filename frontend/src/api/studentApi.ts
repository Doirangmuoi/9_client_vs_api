import axiosClient from './axiosClient';
import { Student, ApiResponse } from '../types/student';

/**
 * Module chứa các hàm gọi API tới các Endpoint của Student
 */
export const studentApi = {
  /**
   * Gọi API lấy danh sách toàn bộ sinh viên
   * GET /api/v1/students
   */
  getAll: (): Promise<ApiResponse<Student[]>> => {
    return axiosClient.get('/students');
  },

  /**
   * Gọi API tạo sinh viên mới
   * POST /api/v1/students
   */
  create: (student: Student): Promise<ApiResponse<Student>> => {
    return axiosClient.post('/students', student);
  },
};