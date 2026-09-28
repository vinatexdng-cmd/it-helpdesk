# L2TP/IPsec kết nối nhưng máy không có Internet

## Mô tả
Sau khi kết nối VPN L2TP/IPsec, Internet trên máy người dùng mất hoặc lưu lượng đi sai đường.

## Kiểm tra
```cmd
ipconfig /all
route print
```
- Xem default route trước và sau khi kết nối VPN.
- Xác định VPN đang cấu hình full tunnel hay split tunnel theo thiết kế.
- Kiểm tra DNS được sử dụng sau kết nối.
- Xác định Internet chỉ mất trên máy hay VPN nhiều người cùng gặp.

## Hướng xử lý
Nếu hệ thống được thiết kế split tunnel, kiểm tra route/policy có đúng subnet nội bộ không. Nếu full tunnel, Internet phải đi qua gateway/firewall VPN theo chính sách; cần kiểm tra NAT và policy ở phía tập trung.

## An toàn
Không tắt firewall hoặc thay đổi chính sách VPN chỉ để khôi phục Internet tạm thời. Không thay đổi thiết kế full/split tunnel nếu chưa được phê duyệt.

## Từ khóa
L2TP, IPsec, VPN không Internet, route, MikroTik, full tunnel, split tunnel