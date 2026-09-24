# Không đăng nhập được Windows bằng tài khoản domain

## Biểu hiện
Windows báo sai username/password, domain không khả dụng, trust relationship hoặc người dùng mới không đăng nhập được.

## Khoanh vùng
- Máy đang ở mạng công ty/VPN phù hợp không?
- Người dùng cũ trên máy đăng nhập được không?
- Tài khoản có bị khóa/hết hạn không?
- Máy còn join domain đúng không?

## Kiểm tra
```cmd
whoami
ipconfig /all
```
Với quyền phù hợp, kiểm tra trạng thái domain/DNS và tài khoản từ công cụ quản trị.

## Xử lý
Lỗi tài khoản: xử lý lockout/password theo quy trình. Lỗi mạng/DNS: khôi phục kết nối domain. Lỗi trust relationship: chuyển kỹ thuật viên có quyền quản trị domain/máy tính xử lý, không tự ý remove/rejoin domain nếu chưa bảo đảm profile và dữ liệu người dùng.

## Từ khóa
Windows domain, đăng nhập, Active Directory, trust relationship, account locked