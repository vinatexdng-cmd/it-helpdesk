# Máy in Offline hoặc không in được

## Mô tả
Người dùng gửi lệnh in nhưng máy không in, Windows báo Offline, Error hoặc tài liệu nằm trong hàng đợi.

## Nguyên nhân thường gặp
- Máy in tắt, lỗi giấy/mực hoặc mất kết nối.
- Sai máy in mặc định.
- Máy in mạng đổi IP hoặc không ping được.
- Print Queue bị kẹt.
- Print Spooler lỗi.
- Driver máy in lỗi hoặc không tương thích.
- Máy chủ chia sẻ máy in không hoạt động.

## Kiểm tra nhanh
1. Kiểm tra nguồn, giấy, mực và màn hình lỗi trên máy in.
2. Với máy in mạng, xác định IP và thử:
```cmd
ping <ip-may-in>
```
3. Mở Settings > Printers & scanners và kiểm tra trạng thái.
4. Mở hàng đợi in và xác định job bị treo.

## Xử lý hàng đợi in
Thử hủy job từ giao diện trước. Nếu Print Spooler bị lỗi, IT có thể kiểm tra dịch vụ:
```powershell
Get-Service Spooler
Restart-Service Spooler
```
Chỉ xóa thủ công dữ liệu spool khi đã xác nhận không còn job hợp lệ cần giữ.

## Máy in mạng
- Kiểm tra IP hiện tại của máy in.
- Kiểm tra port TCP/IP trên Windows.
- Nếu nhiều máy cùng không in được, ưu tiên kiểm tra máy in, mạng và print server.

## Chuyển cấp
- Máy in báo lỗi phần cứng.
- Không ping được máy in trong khi các thiết bị cùng VLAN bình thường.
- Nhiều người dùng cùng mất máy in chia sẻ.
- Driver chuẩn đã cài lại nhưng lỗi tiếp diễn.

## Từ khóa
máy in, printer offline, spooler, print queue, không in được, máy in mạng