# Trùng địa chỉ IP - IP Conflict

## Biểu hiện
Windows báo IP address conflict, mạng chập chờn hoặc thiết bị lúc truy cập được lúc không.

## Kiểm tra
```cmd
ipconfig /all
arp -a
```
- Xác định IP hiện tại, DHCP Enabled, Default Gateway và DHCP Server.
- Kiểm tra IP được cấp động hay cấu hình tĩnh.
- Nếu có hệ thống DHCP quản trị tập trung, kiểm tra lease/reservation theo quyền được cấp.

## Xử lý
1. Với máy dùng DHCP, thử `ipconfig /release` rồi `ipconfig /renew` khi phù hợp.
2. Nếu thiết bị đang dùng IP tĩnh, đối chiếu danh sách IP được cấp trước khi thay đổi.
3. Không tự chọn một IP khác chỉ vì thấy đang trống tại thời điểm kiểm tra.

## Chuyển cấp
Conflict tái diễn, nhiều thiết bị bị ảnh hưởng hoặc nghi DHCP rogue/sai cấu hình VLAN.

## Từ khóa
IP conflict, trùng IP, DHCP, ARP, mất mạng