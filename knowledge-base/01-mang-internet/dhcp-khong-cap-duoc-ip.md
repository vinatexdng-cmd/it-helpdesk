# Máy tính không nhận được IP từ DHCP

## Biểu hiện
Máy không vào mạng và nhận địa chỉ dạng 169.254.x.x hoặc không có Default Gateway.

## Kiểm tra
```cmd
ipconfig /all
ipconfig /release
ipconfig /renew
```
1. Kiểm tra cáp/Wi-Fi và trạng thái card mạng.
2. Xác định máy đang ở đúng VLAN/SSID không.
3. Kiểm tra DHCP Enabled.
4. So sánh với một máy hoạt động tốt cùng vị trí.

## Cách hiểu
Địa chỉ APIPA 169.254.x.x thường cho thấy máy không nhận được lease IPv4 từ DHCP. Tuy nhiên vẫn cần kiểm tra kết nối vật lý/VLAN trước khi kết luận DHCP Server lỗi.

## Chuyển cấp
Nhiều máy cùng VLAN không nhận IP, DHCP scope hết địa chỉ hoặc nghi relay/VLAN/switch cấu hình sai.

## Từ khóa
DHCP, 169.254, APIPA, không nhận IP, VLAN