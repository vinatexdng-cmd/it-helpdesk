# Windows Update tải hoặc cài đặt bị lỗi

## Biểu hiện
Windows Update đứng ở một tỷ lệ lâu, báo Download/Install error hoặc yêu cầu restart lặp lại.

## Kiểm tra
- Máy có Internet ổn định không.
- Ổ C còn đủ dung lượng không.
- Mã lỗi Windows Update là gì.
- Máy có thuộc hệ thống quản trị WSUS/Intune/chính sách cập nhật tập trung không.
- Có pending restart không.

## Xử lý
1. Ghi lại mã lỗi trước khi thay đổi.
2. Khởi động lại máy nếu đang pending restart.
3. Kiểm tra ngày giờ và kết nối mạng.
4. Chạy Windows Update Troubleshooter nếu phù hợp.
5. Không tự ý đổi registry hoặc vô hiệu hóa dịch vụ cập nhật trên máy được quản trị tập trung.

## Chuyển cấp
Nhiều máy cùng lỗi, lỗi policy/WSUS, bản cập nhật gây lỗi nghiệp vụ diện rộng hoặc cập nhật thất bại nhiều lần.

## Từ khóa
Windows Update, update error, WSUS, restart, download update