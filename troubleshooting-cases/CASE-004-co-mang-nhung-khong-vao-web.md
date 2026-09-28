# CASE-004 - Có mạng nhưng không vào được website

## Người dùng báo
"Biểu tượng mạng vẫn bình thường nhưng em không vào được web."

## Kiểm tra thực tế
```cmd
ipconfig /all
ping <default-gateway>
ping 8.8.8.8
nslookup google.com
```

## Cách đọc kết quả
- Gateway không ping được: kiểm tra LAN/Wi-Fi trước.
- Gateway được, 8.8.8.8 không được: kiểm tra đường ra Internet/firewall.
- 8.8.8.8 được nhưng `nslookup` lỗi: ưu tiên DNS.
- DNS bình thường nhưng chỉ một website lỗi: kiểm tra website, proxy, browser hoặc policy.

## Xử lý điển hình khi cache DNS lỗi
```cmd
ipconfig /flushdns
```
Sau đó kiểm tra lại `nslookup` và trình duyệt.

## Bài học Helpdesk
Cụm từ "không vào mạng" của người dùng chưa đủ để kết luận. Phải tách LAN, Internet và DNS bằng các phép thử đơn giản trước.

## Từ khóa
case, có mạng không vào web, DNS, ping, nslookup, internet