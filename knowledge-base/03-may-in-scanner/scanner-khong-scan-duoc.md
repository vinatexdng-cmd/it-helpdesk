# Scanner không scan được

## Kiểm tra
1. Scanner/máy in đa chức năng có nguồn và không báo lỗi.
2. Nếu scan qua mạng, ping IP thiết bị.
3. Kiểm tra driver TWAIN/WIA hoặc phần mềm scan được phê duyệt.
4. Nếu Scan to Folder, kiểm tra đường dẫn, tài khoản dịch vụ và quyền thư mục.
5. Nếu Scan to Email, kiểm tra cấu hình mail/SMTP theo quyền quản trị.

## Phân loại
- Scan từ PC lỗi nhưng copy trực tiếp được: tập trung driver/phần mềm/kết nối.
- Scan to Folder lỗi cho nhiều người: tập trung SMB/quyền/tài khoản.
- Scan to Email lỗi diện rộng: tập trung SMTP/DNS/network.

## Bảo mật
Không ghi mật khẩu tài khoản scan vào tài liệu Knowledge Base. Credential thiết bị phải được quản lý theo quy trình nội bộ.

## Từ khóa
scanner, scan to folder, scan to email, TWAIN, WIA, SMB