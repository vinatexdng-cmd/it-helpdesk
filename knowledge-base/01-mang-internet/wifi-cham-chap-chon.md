# Wi-Fi chậm hoặc chập chờn

## Khoanh vùng
- Một người hay nhiều người cùng bị?
- Chỉ một khu vực hay toàn đơn vị?
- LAN dây có bình thường không?
- Thiết bị đang kết nối đúng SSID doanh nghiệp không?

## Kiểm tra máy trạm
```cmd
netsh wlan show interfaces
ipconfig /all
ping <default-gateway>
```
Quan sát tín hiệu, gateway, độ trễ và packet loss. Có thể thử ở vị trí gần Access Point để so sánh.

## Nguyên nhân thường gặp
Tín hiệu yếu, roaming, nhiễu vô tuyến, quá nhiều client trên AP, uplink AP/switch có vấn đề, DHCP/DNS hoặc Internet upstream.

## Xử lý
Không tự ý đổi channel/công suất AP khi chưa có dữ liệu và quyền quản trị. Với lỗi nhiều người, thu thập vị trí, thời điểm, SSID, AP nếu biết và phạm vi ảnh hưởng trước khi chuyển cấp.

## Từ khóa
WiFi chậm, Wi-Fi chập chờn, signal, packet loss, access point