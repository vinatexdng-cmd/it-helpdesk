# CASE-005 - Ổ mạng biến mất hoặc dấu X đỏ

## Người dùng báo
"Ổ Z hôm qua còn dùng được, hôm nay không mở được."

## Quy trình
1. Xác định người dùng đang ở LAN công ty hay kết nối từ xa qua VPN.
2. Kiểm tra `net use`.
3. Thử mở trực tiếp `\\server\share`.
4. Ping server bằng hostname và IP để tách DNS khỏi kết nối mạng.
5. Kiểm tra quyền nếu server truy cập được nhưng share báo Access Denied.
6. Chỉ map lại ổ khi đường dẫn và quyền đã được xác nhận.

## Lệnh tham khảo
```cmd
net use
net use Z: \\server\share /persistent:yes
```

## Lưu ý
Không ghi mật khẩu thật vào lệnh/script lưu trong Knowledge Base. Nếu cần cấp quyền mới phải tuân thủ quy trình phê duyệt dữ liệu.

## Từ khóa
case, ổ Z, network drive, file server, access denied, map drive