# CASE-022 - Cả phòng không in được do máy in đổi IP

## Người dùng báo
"Sáng nay cả phòng đều thấy máy in Offline."

## Quy trình
1. Vì nhiều người cùng lỗi, ưu tiên kiểm tra máy in/hạ tầng thay vì từng PC.
2. Xem IP hiện tại của máy in.
3. So sánh với Standard TCP/IP Port/print server.
4. Ping IP hiện tại và kiểm tra quy hoạch DHCP/IP.
5. Cập nhật port theo địa chỉ chính thức rồi in thử.

## Nguyên nhân điển hình
Máy in lấy DHCP động và nhận địa chỉ mới trong khi client vẫn gửi tới IP cũ.

## Phòng ngừa
Thiết lập IP ổn định bằng phương án quản trị được doanh nghiệp lựa chọn và cập nhật inventory.

## Từ khóa
case, máy in offline, đổi IP, DHCP, TCP/IP port