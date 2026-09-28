# VPN kết nối nhưng không truy cập được mạng nội bộ

## Mô tả
VPN báo Connected nhưng người dùng không truy cập được server, ổ mạng hoặc ứng dụng nội bộ.

## Kiểm tra
- Internet tại máy người dùng có ổn định không.
- VPN có nhận địa chỉ IP không.
- Có ping được IP máy chủ nội bộ không.
- Có phân giải được hostname nội bộ không.
- Route đến mạng nội bộ có tồn tại không.

```cmd
ipconfig /all
route print
ping <ip-server-noi-bo>
nslookup <ten-server-noi-bo>
```

## Phân loại
- Ping IP được, hostname không được: kiểm tra DNS VPN.
- Không ping IP được: kiểm tra route, ACL/firewall, VPN policy.
- Chỉ một ứng dụng lỗi: kiểm tra port/dịch vụ ứng dụng.
- Nhiều người VPN cùng lỗi: ưu tiên hạ tầng VPN/firewall.

## Xử lý
Ngắt/kết nối lại VPN sau khi kiểm tra Internet. Không tự ý thêm route tĩnh, đổi DNS hoặc tắt firewall nếu chưa xác định thiết kế mạng và chính sách doanh nghiệp.

## Chuyển cấp
Chuyển quản trị mạng khi thiếu route, DNS nội bộ không được cấp, ACL/firewall chặn, pool VPN hết địa chỉ hoặc nhiều người dùng cùng bị ảnh hưởng.

## Từ khóa
VPN, connected, không vào server, route, DNS, firewall, remote