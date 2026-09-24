# Máy tính chạy chậm hoặc thường xuyên bị treo

## Mô tả
Máy khởi động lâu, mở ứng dụng chậm, thao tác bị đứng hoặc thường xuyên xuất hiện Not Responding.

## Nguyên nhân thường gặp
- CPU, RAM hoặc ổ đĩa sử dụng cao.
- Quá nhiều chương trình khởi động cùng Windows.
- Ổ C gần đầy.
- Windows Update/antivirus đang chạy nền.
- Ổ HDD/SSD có dấu hiệu lỗi.
- Trình duyệt mở quá nhiều tab hoặc ứng dụng rò rỉ bộ nhớ.
- Malware hoặc phần mềm không phù hợp.

## Kiểm tra
1. Mở Task Manager (`Ctrl + Shift + Esc`).
2. Kiểm tra CPU, Memory, Disk và tiến trình sử dụng cao.
3. Kiểm tra dung lượng ổ C.
4. Kiểm tra tab Startup Apps.
5. Xem Windows Update và trạng thái phần mềm bảo mật.

Có thể dùng:
```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Get-PSDrive C
```

## Cách xử lý
- Đóng ứng dụng không cần thiết.
- Khởi động lại nếu máy đã hoạt động liên tục lâu ngày.
- Dọn file tạm bằng công cụ Windows phù hợp.
- Tắt ứng dụng Startup không cần thiết theo chính sách IT.
- Cập nhật Windows/driver khi đã xác định phù hợp.
- Nếu Disk thường xuyên 100% hoặc có lỗi I/O, kiểm tra sức khỏe ổ đĩa và sao lưu dữ liệu trước khi can thiệp sâu.

## Không nên làm
- Không dùng phần mềm 'tăng tốc máy' không rõ nguồn gốc.
- Không xóa thủ công thư mục hệ thống.
- Không vô hiệu hóa antivirus chỉ để làm máy nhanh hơn.

## Chuyển cấp
Chuyển kỹ thuật phần cứng nếu máy có lỗi ổ đĩa, RAM, nhiệt độ bất thường, BSOD lặp lại hoặc hiệu năng vẫn kém sau khi đã loại trừ phần mềm.

## Từ khóa
máy chậm, treo máy, CPU 100, RAM cao, disk 100, startup, Windows