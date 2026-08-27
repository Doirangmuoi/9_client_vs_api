export interface ApiResponse<T = any> {
  // Trạng thái xử lý của Request (true nếu thành công, false nếu thất bại)
  success: boolean;

  // Thông điệp phản hồi từ Server (thường dùng hiển thị thông báo trên UI)
  message: string;

  // Dữ liệu chính trả về (Danh sách, Đối tượng, v.v. - Có thể undefined nếu là lỗi)
  data?: T;

  // Tổng số lượng phần tử (Dùng cho các API danh sách/phân trang)
  total?: number;

  // Mã lỗi chi tiết hoặc danh sách lỗi Validate (Nếu có)
  errors?: any;
}