# Tài khoản bị khóa lặp lại

## Biểu hiện
IT mở khóa tài khoản nhưng một thời gian ngắn sau lại bị khóa.

## Nguyên nhân thường gặp
Credential cũ còn lưu trên điện thoại, Outlook, mapped drive, scheduled task, service, máy khác hoặc phiên Remote Desktop.

## Quy trình
1. Xác định thời điểm lockout gần nhất.
2. Kiểm tra nguồn lockout bằng log/công cụ quản trị được cấp quyền.
3. Hỏi người dùng có thiết bị hoặc ứng dụng nào còn dùng mật khẩu cũ không.
4. Cập nhật credential tại nguồn gây lockout, không chỉ unlock lặp lại.

## Bảo mật
Nếu nguồn đăng nhập lạ hoặc số lần thất bại bất thường, xử lý như sự kiện an toàn thông tin thay vì chỉ reset mật khẩu.

## Từ khóa
account lockout, khóa tài khoản, mật khẩu cũ, credential, Active Directory