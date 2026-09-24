# Không tìm thấy đường dẫn mạng - Network Path Not Found

## Biểu hiện
Mở `\\server\share` báo network path not found, name not found hoặc không kết nối được.

## Kiểm tra
```cmd
ping <server-ip>
nslookup <server-name>
```
Thử truy cập bằng hostname và IP nếu chính sách cho phép để phân biệt DNS với kết nối.

## Phân loại
- IP không tới được: routing/firewall/server/network.
- IP tới được nhưng hostname không resolve: DNS.
- Server tới được nhưng share cụ thể lỗi: SMB/share/service/quyền.

## Lưu ý
Không bật lại SMB phiên bản cũ hoặc tắt firewall như một biện pháp thử mặc định. Các giao thức cũ có rủi ro bảo mật và phải theo chính sách hệ thống.

## Từ khóa
network path not found, UNC, SMB, DNS, file server