# Máy in mạng đổi IP làm máy tính không in được

## Biểu hiện
Máy in vẫn hoạt động nhưng các máy tính đồng loạt báo Offline; kiểm tra thấy IP thiết bị khác với port TCP/IP đã cấu hình.

## Kiểm tra
1. Xem IP hiện tại trên máy in/trang cấu hình.
2. Ping IP mới.
3. Kiểm tra Standard TCP/IP Port trên máy tính hoặc print server.
4. Xác định máy in nên dùng DHCP reservation hay IP tĩnh theo thiết kế mạng.

## Xử lý
Cập nhật port theo địa chỉ được quản trị chính thức. Sau đó in test và cập nhật inventory nếu có thay đổi hợp lệ.

## Phòng ngừa
Thiết bị hạ tầng/máy in cần địa chỉ ổn định nên được quản lý IP tập trung; tránh tự đặt IP ngoài quy hoạch.

## Từ khóa
máy in đổi IP, printer offline, TCP/IP port, DHCP reservation, máy in mạng