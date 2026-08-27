import { Router } from 'express'; // Import Router từ Express
import { StudentController } from '../controllers/student.controller'; // Import Controller
import { StudentService } from '../services/student.service';
import { MySqlStudentRepository } from '../repositories/mysql-student.repository';
import { InMemoryStudentRepository } from '../repositories/in-memory-student.repository';

// Khởi tạo Express Router
const studentRouter = Router();
// Ví dụ trong index.ts hoặc container.ts
// const studentRepository = new MySqlStudentRepository();      // → chạy MySQL
// hoặc
// const studentRepository = new MongoStudentRepository();      // → chạy MongoDB
// // hoặc
const studentRepository = new InMemoryStudentRepository(); 
// Khởi tạo instance của StudentController
const service = new StudentService(
	studentRepository as ConstructorParameters<typeof StudentService>[0],
);
const studentController = new StudentController(service);

// Định tuyến đường dẫn HTTP POST -> Hàm createStudent trong Controller
studentRouter.post('/', studentController.createStudent);

// Định tuyến đường dẫn HTTP GET -> Hàm getAllStudents trong Controller
studentRouter.get('/', studentController.getAllStudents);

// Định tuyến cập nhật và xóa sinh viên theo rollNumber trên URL
studentRouter.put('/:rollNumber', studentController.updateStudent);
studentRouter.delete('/:rollNumber', studentController.deleteStudent);

// Xuất Router để đăng ký vào file chính index.ts
export default studentRouter;