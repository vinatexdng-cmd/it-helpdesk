# CASE-003 - Máy in mạng báo Offline

## Người dùng báo
"Máy in phòng em hôm qua vẫn in được, sáng nay tất cả lệnh đều nằm trong hàng đợi và báo Offline."

## Mục tiêu
Xác định lỗi ở máy người dùng, kết nối mạng hay chính máy in trước khi cài lại driver.

## Quy trình xử lý thực tế
1. Xác nhận chỉ một người hay cả phòng không in được.
2. Kiểm tra máy in đang bật, không báo kẹt giấy/hết mực/lỗi phần cứng.
3. Lấy IP máy in và `ping <ip-may-in>`.
4. Nếu ping được, kiểm tra Windows Print Queue và port TCP/IP.
5. Hủy job lỗi nếu phù hợp; kiểm tra/restart Print Spooler khi hàng đợi bị treo.
6. Nếu không ping được từ nhiều máy, chuyển hướng kiểm tra IP/VLAN/switch hoặc bản thân máy in.

## Kết luận chẩn đoán
Không nên cài lại driver ngay từ bước đầu. Việc xác định phạm vi ảnh hưởng và khả năng ping máy in giúp tránh xử lý sai lớp.

## Thông tin đóng ticket
Ghi nguyên nhân thực tế, IP máy in, phạm vi ảnh hưởng, thao tác đã làm và kết quả in thử.

## Từ khóa
case, máy in offline, spooler, print queue, printer network