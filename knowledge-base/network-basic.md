# Kiến thức Network cơ bản
## 1. IP Address & Subnet Mask
- IP tĩnh (Static IP) và IP động (DHCP)
- Cấu trúc IPv4: `192.168.x.x`
- Subnet Mask thường dùng; `255.255.255.0`

## 2. Gateway & DNS
- Gateway: Địa chỉ của router/modem, thường là `192.168.1.1`
- DNS: Dịch tên miền thành IP, ví dụ: `8.8.8.8` (Google DNS)

## 3. Các lệnh kiểm tra mạng
| Lệnh | Chức năng |
|------|-----------|
|`ping` | Kiểm tra kết nối |
|`ipconfig` / `ifconfig` | Xem cấu hình mạng |
|`nslookup` | Kiểm tra DNS |
|`tracert` / `traceroute` | Kiểm tra đường đi đến server |
|`netstat` | Xem các kết nối đang hoạt động |

## 4. Các lỗi thường gặp
- Không vào được mạng nội bộ / Internet
- Không nhận IP
- Đụng IP
- DNS sai
- Firewall chặn kết nối

## 5. Cách xử lý nhanh
- Gõ `ipconfig /release` -> `ipconfig /renew`
- Gán IP tĩnh để thử
- Đổi DNS thành `8.8.8.8`
- Restart modem/router
- Dùng dây mạng khác / thử cổng khác
