# CASE-007 - Ổ C gần đầy làm máy chậm

## Người dùng báo
"Máy rất chậm và Windows báo ổ C sắp hết dung lượng."

## Kiểm tra
- Dung lượng trống ổ C.
- Downloads/Desktop và dữ liệu người dùng lớn.
- Temporary files/Windows Update cleanup.
- Ứng dụng tạo log/cache bất thường.
- OneDrive hoặc dữ liệu đồng bộ chiếm dung lượng cục bộ.

## Xử lý an toàn
1. Xác định dữ liệu nào có thể xóa theo chính sách.
2. Ưu tiên công cụ Storage/Temporary files của Windows.
3. Di chuyển dữ liệu công việc sang vị trí lưu trữ được doanh nghiệp cho phép khi phù hợp.
4. Kiểm tra lại dung lượng và hiệu năng.

## Không nên làm
Không xóa thủ công `Windows`, `Program Files`, `WinSxS` hoặc dữ liệu người dùng khi chưa xác định rõ. Không dùng công cụ dọn rác không rõ nguồn gốc.

## Chuyển cấp
Dung lượng tăng bất thường trở lại, nghi log ứng dụng lỗi, ổ đĩa quá nhỏ cho nhu cầu nghiệp vụ hoặc có dấu hiệu lỗi phần cứng.

## Từ khóa
case, ổ C đầy, disk full, máy chậm, storage, temporary files