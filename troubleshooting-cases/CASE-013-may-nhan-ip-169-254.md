# CASE-013 - Máy nhận IP 169.254.x.x và không vào mạng

## Người dùng báo
"Máy em cắm dây mạng rồi nhưng vẫn không có Internet."

## Kiểm tra
```cmd
ipconfig /all
```
Nếu IPv4 là 169.254.x.x và không có gateway phù hợp, kiểm tra tiếp link vật lý, VLAN và DHCP.

## Quy trình
1. Kiểm tra dây/port mạng và trạng thái adapter.
2. So sánh với máy tốt cùng vị trí.
3. Thử renew DHCP khi kết nối vật lý đã ổn.
4. Nếu nhiều máy cùng khu vực bị, chuyển kiểm tra switch/VLAN/DHCP thay vì xử lý riêng máy.

## Bài học
169.254.x.x là dấu hiệu quan trọng nhưng không đủ để kết luận DHCP Server hỏng; lỗi có thể nằm trước DHCP như port/VLAN.

## Từ khóa
case, 169.254, APIPA, DHCP, không có mạng