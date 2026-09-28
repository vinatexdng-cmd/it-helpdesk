# DNS (Domain Name System) là hệ thống phân giải tên miền sang địa chỉ IP. Đổi DNS có thể giúp:
- Truy cập Web nhanh hơn
- Bypass một số chặn web ở cấp DNS
- Tăng độ ổn định khi dùng mạng

# DNS phổ biến
| Nhà cung cấp | DNS IPv4 chính     | DNS IPv4 phụ     | Ghi chú---------|
|--------------|--------------------|------------------|-----------------|
| Google       | 8.8.8.8            | 8.8.4.4          | Nhanh, ổn định  |
| Cloudflare   | 1.1.1.1            | 1.0.0.1          | Bảo mật tốt     |
|OpenDNS       | 208.67.222.222     | 208.67.220.220   | Có lọc nội dung |

# Đổi DNS thủ công (Giao diện GUI)
1. Mở `ncpa.cpl` (Windows + R)
2. Chọn Properties card mạng
3. Chọn IPv4 -> nhập DNS
4. Check lại bằng `nslookup` (Windows + R / CMD)

# Kiểm tra kết nối mạng
- `ping 127.0.0.1` : kiểm tra TCP/IP local
- `ping 8.8.8.8` : kiểm tra ra ngoài Internet
- `ping google.com` : kiểm tra DNS hoạt động
- `tracert google.com` : xem đường đi gói tin
- `nslookup` : kiểm tra máy chủ DNS đang dùng

# Đổi DNS qua Command Prompt (CMD) trên Windows
1. Chạy CMD (Run as administrator)
2. `netsh interface show interface` : xem tên kết nối mạng là Wi-fi hoặc Ethernet
3. | Đặt DNS của Google | Đặt DNS Cloudflare |
   |--------------------|--------------------|
   | `netsh interface ip set dns name="Wi-fi" source=static addr=8.8.8.8` | `netsh interface ipv4 set dns name="Wi-fi" static 1.1.1.1 primary` |
   | `netsh interface ip add dns name="Wi-fi" addr=8.8.4.4 index=2` | `netsh interface ipv4 add dns name="Wi-fi" 1.0.0.1 index=2` |

   ## Lưu ý: nếu adapter tên khác (ví dụ Ethernet) thì thay "Wi-fi" bằng "Ethernet"
5. Kiểm tra lại DNS đã được đổi chưa: `nslookup google.com`
6. Gỡ DNS nếu muốn quay về tự động: `netsh interface ip set dns name="Wi-fi" source=dhcp` hoặc `netsh interface ipv4 set dns name="Wi-fi" dhcp`

## Ghi chú về IPv6
- Windows vẫn bật IPv6 mặc định, nhưng đa số DNS truy vấn vẫn qua IPv4
- Chỉ cần đổi DNS IPv4 là đủ trong hầu hết trường hợp
- Nếu cần đổi DNS IPv6:

  `netsh interface ipv6 set dns name="Wi-fi" source=static address=2001:4860:4860:8888`
  
  `netsh interface ipv6 add dns name="Wi-fi" address=2001:4860:4860::8844 index=2 `
