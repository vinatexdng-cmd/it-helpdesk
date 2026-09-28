# DNS không phân giải được tên miền

## Mô tả
Máy có kết nối mạng, ping được địa chỉ IP ngoài Internet nhưng không mở được website bằng tên miền hoặc ứng dụng báo không tìm thấy máy chủ.

## Dấu hiệu nhận biết
```cmd
ping 8.8.8.8
nslookup google.com
ipconfig /all
```
Nếu ping IP thành công nhưng `nslookup` thất bại, DNS là hướng cần ưu tiên kiểm tra.

## Nguyên nhân
- DNS server không phản hồi.
- Máy nhận sai DNS từ DHCP.
- Cache DNS cục bộ lỗi.
- VPN/Proxy thay đổi cấu hình phân giải tên.
- DNS nội bộ hoặc đường truyền đến DNS gặp sự cố.

## Xử lý
1. Kiểm tra DNS hiện tại bằng `ipconfig /all`.
2. Chạy:
```cmd
ipconfig /flushdns
```
3. Kiểm tra:
```cmd
nslookup google.com
nslookup <ten-may-chu-noi-bo>
```
4. Nếu nhiều máy cùng lỗi, kiểm tra DHCP/DNS server thay vì cấu hình thủ công từng máy.
5. Không tự ý đặt DNS công cộng nếu máy cần phân giải tên miền nội bộ của doanh nghiệp.

## Chuyển cấp
Chuyển quản trị mạng khi nhiều máy không phân giải được DNS, DNS nội bộ không phản hồi hoặc nghi ngờ cấu hình DHCP/DNS/VLAN.

## Từ khóa
DNS, nslookup, không vào web, phân giải tên miền, flushdns, internet