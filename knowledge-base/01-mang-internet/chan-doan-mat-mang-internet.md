# Chẩn đoán mất mạng LAN / Internet

## Mô tả sự cố
Dùng khi một máy tính không truy cập được mạng nội bộ hoặc Internet, biểu tượng mạng báo mất kết nối, Limited/No Internet hoặc người dùng phản ánh web và ứng dụng mạng không hoạt động.

## Biểu hiện thường gặp
- Không mở được website.
- Không truy cập được máy chủ hoặc thư mục dùng chung.
- Máy khác cùng khu vực vẫn hoạt động bình thường.
- Có địa chỉ IP nhưng không truy cập Internet.
- Địa chỉ IPv4 dạng 169.254.x.x.

## Nguyên nhân có thể
1. Cáp mạng, Wi-Fi hoặc card mạng mất kết nối.
2. DHCP không cấp được địa chỉ IP.
3. Sai Default Gateway hoặc DNS.
4. Xung đột địa chỉ IP.
5. Switch/AP/uplink có sự cố.
6. Proxy, VPN, firewall hoặc phần mềm bảo mật ảnh hưởng kết nối.

## Kiểm tra nhanh
```cmd
ipconfig /all
ping 127.0.0.1
ping <default-gateway>
ping 8.8.8.8
nslookup google.com
```

## Cách xử lý
### Bước 1 - Xác định phạm vi
Hỏi xem chỉ một máy hay nhiều máy cùng khu vực bị lỗi. Nếu nhiều máy cùng lỗi, ưu tiên kiểm tra thiết bị mạng/uplink thay vì sửa từng máy.

### Bước 2 - Kiểm tra kết nối vật lý
Kiểm tra dây mạng, đèn link trên máy/switch hoặc trạng thái Wi-Fi. Thử đổi dây/cổng mạng khi cần.

### Bước 3 - Kiểm tra IP
Chạy `ipconfig /all`. Nếu nhận IP 169.254.x.x, kiểm tra DHCP/VLAN và thử:
```cmd
ipconfig /release
ipconfig /renew
```

### Bước 4 - Phân lớp lỗi
- Không ping được Gateway: tập trung LAN/VLAN/cáp/card mạng.
- Ping Gateway được nhưng không ping 8.8.8.8: kiểm tra gateway/firewall/uplink Internet.
- Ping 8.8.8.8 được nhưng tên miền không được: kiểm tra DNS.

### Bước 5 - DNS
```cmd
ipconfig /flushdns
nslookup google.com
```
Không tự ý đổi DNS trên máy thuộc hệ thống quản trị tập trung nếu chưa xác định chính sách mạng.

## Khi nào chuyển cấp
- Nhiều máy hoặc cả khu vực mất mạng.
- DHCP không cấp IP cho nhiều thiết bị.
- Không ping được gateway dù kết nối vật lý bình thường.
- Nghi ngờ switch, VLAN, firewall hoặc đường truyền WAN.

## Thông tin cần ghi vào ticket
Tên máy, người dùng, đơn vị, IP, gateway, thời điểm lỗi, phạm vi ảnh hưởng và kết quả các lệnh kiểm tra.

## Từ khóa
mất mạng, internet, LAN, no internet, limited, DHCP, gateway, DNS, 169.254, network