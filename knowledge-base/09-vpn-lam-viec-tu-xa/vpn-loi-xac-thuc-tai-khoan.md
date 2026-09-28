# VPN không xác thực được tài khoản

## Biểu hiện
VPN báo authentication failed, credentials rejected hoặc kết nối bị từ chối ngay sau khi nhập tài khoản.

## Kiểm tra
- Username/domain có đúng định dạng không.
- Tài khoản có bị khóa/hết hạn không.
- Mật khẩu có vừa thay đổi không.
- Người dùng có thuộc nhóm được phép VPN không.
- MFA/certificate nếu hệ thống yêu cầu có hợp lệ không.

## Xử lý
Xác nhận trạng thái tài khoản qua công cụ quản trị được cấp quyền. Hướng dẫn người dùng nhập lại thông tin nhưng không yêu cầu họ gửi mật khẩu cho IT.

## Bảo mật
Nhiều lần xác thực thất bại bất thường có thể là dấu hiệu tấn công hoặc credential stuffing; cần chuyển cho bộ phận an toàn thông tin nếu vượt ngưỡng/quy trình cảnh báo.

## Từ khóa
VPN authentication failed, mật khẩu, account locked, MFA, remote access