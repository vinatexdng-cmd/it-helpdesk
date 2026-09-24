# CASE-014 - VPN Connected nhưng không vào được File Server

## Người dùng báo
"VPN đã báo Connected nhưng ổ mạng và server vẫn không mở được."

## Kiểm tra
```cmd
ipconfig /all
route print
nslookup <server-name>
```
Thử tài nguyên nội bộ bằng IP và hostname theo phạm vi được phép.

## Phân tích
- Không tới IP server: routing/firewall/VPN policy.
- Tới IP nhưng hostname lỗi: DNS nội bộ.
- Server tới được nhưng share Access Denied: quyền file server.
- Mạng nhà có subnet trùng mạng công ty: có thể gây route sai.

## Thông tin ticket
IP VPN, mạng Internet hiện tại, route tới subnet đích, server cần truy cập và kết quả IP/hostname.

## Từ khóa
case, VPN connected, file server, route, DNS, mapped drive