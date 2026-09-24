# Ổ mạng mất sau khi khởi động lại máy

## Biểu hiện
Ổ Z, Y hoặc ổ mạng đã map không xuất hiện sau restart hoặc xuất hiện dấu X đỏ.

## Kiểm tra
```cmd
net use
```
- Kiểm tra đường dẫn UNC còn truy cập được không.
- Máy đã kết nối LAN/VPN trước khi mở ổ mạng chưa.
- Mapping có persistent không.
- Nếu doanh nghiệp map drive bằng GPO/script, kiểm tra policy đã áp dụng chưa.

## Xử lý
Không tạo nhiều mapping trùng nhau. Xác định cơ chế chuẩn của doanh nghiệp: GPO, logon script hay map thủ công. Chỉ map lại thủ công khi phù hợp.

## Từ khóa
mapped drive, ổ Z mất, net use, persistent, GPO, file server