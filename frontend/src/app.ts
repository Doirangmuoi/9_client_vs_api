import { studentApi } from './api/studentApi';
import { Student } from './types/student';

// Lấy các phần tử DOM
const studentForm = document.getElementById('studentForm') as HTMLFormElement;
const rollNumberInput = document.getElementById('rollNumber') as HTMLInputElement;
const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const studentTableBody = document.getElementById('studentTableBody') as HTMLElement;
const alertBox = document.getElementById('alertBox') as HTMLElement;

/**
 * Hiển thị thông báo trên giao diện
 */
function showAlert(message: string, isSuccess: boolean): void {
  alertBox.style.display = 'block';
  alertBox.className = `alert ${isSuccess ? 'alert-success' : 'alert-danger'}`;
  alertBox.innerText = message;

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 4000);
}

/**
 * Luồng 1: Lấy danh sách sinh viên từ API và hiển thị lên Bảng
 */
async function loadStudentList(): Promise<void> {
  try {
    const response = await studentApi.getAll();

    if (response.success && response.data) {
      // Xóa dữ liệu cũ trong bảng
      studentTableBody.innerHTML = '';

      // Duyệt danh sách sinh viên và tạo các dòng HTML
      response.data.forEach((student: Student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.rollNumber}</td>
          <td>${student.fullName}</td>
          <td>${student.email}</td>
          <td>${student.phone}</td>
        `;
        studentTableBody.appendChild(row);
      });
    }
  } catch (error: any) {
    showAlert(error.message, false);
  }
}

/**
 * Luồng 2: Xử lý Lắng nghe Sự kiện Submit Form để Tạo Sinh viên mới
 */
studentForm.addEventListener('submit', async (event: Event) => {
  event.preventDefault(); // Ngăn chặn hành vi reload trang mặc định của Form

  // Thu thập dữ liệu từ Form
  const newStudent: Student = {
    rollNumber: rollNumberInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
  };

  try {
    // Gọi API tạo mới sinh viên
    const response = await studentApi.create(newStudent);

    if (response.success) {
      showAlert(response.message, true);
      studentForm.reset(); // Xóa trắng Form sau khi tạo thành công
      await loadStudentList(); // Tải lại danh sách sinh viên mới nhất
    }
  } catch (error: any) {
    showAlert(error.message, false);
  }
});

// Khởi tạo: Tải danh sách sinh viên khi trang được nạp
document.addEventListener('DOMContentLoaded', () => {
  loadStudentList();
});