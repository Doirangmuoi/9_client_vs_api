export class Student {
  // Khai báo 4 thuộc tính theo đúng yêu cầu đề bài
  public rollNumber: string; // Mã số sinh viên (Khóa chính)
  public email: string; // Địa chỉ email
  public fullName: string; // Họ và tên
  public phone: string; // Số điện thoại

  // Hàm khởi tạo để gán giá trị khi tạo đối tượng mới
  constructor(rollNumber: string, email: string, fullName: string, phone: string) {
    this.rollNumber = rollNumber;
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
  }
}