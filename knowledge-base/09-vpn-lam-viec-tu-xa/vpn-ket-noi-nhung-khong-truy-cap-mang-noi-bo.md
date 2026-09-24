# VPN kết nối thành công nhưng không truy cập được mạng nội bộ

## Biểu hiện
VPN báo Connected nhưng không mở được file server, ứng dụng nội bộ hoặc ping tài nguyên được phép.

## Kiểm tra
```cmd
ipconfig /all
route print
nslookup <ten-may-chu-noi-bo>
```
1. Kiểm tra client có nhận IP VPN không.
2. Kiểm tra route tới subnet nội bộ.
3. Thử tài nguyên bằng IP và hostname để phân biệt routing với DNS.
4. Kiểm tra phạm vi tài nguyên mà tài khoản VPN được phép truy cập.

## Nguyên nhân thường gặp
Thiếu route, split tunnel sai, DNS nội bộ không được cấp, firewall policy, quyền VPN hoặc subnet ở mạng nhà người dùng trùng với subnet công ty.

## Chuyển cấp
Không tự thêm route/firewall rule lâu dài trên máy người dùng nếu chưa được phê duyệt. Chuyển cấp kèm IP VPN, route table, tài nguyên đích và thời điểm lỗi.

## Từ khóa
VPN connected no access, route, DNS nội bộ, split tunnel, subnet