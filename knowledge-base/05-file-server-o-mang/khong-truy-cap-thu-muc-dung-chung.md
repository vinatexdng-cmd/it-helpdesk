# Không truy cập được thư mục dùng chung / File Server

## Mô tả
Người dùng không mở được đường dẫn mạng, ổ đĩa mạng bị dấu X đỏ, Windows báo Access Denied hoặc Network Path Not Found.

## Kiểm tra
1. Xác định đường dẫn UNC chính xác, ví dụ `\\server\share`.
2. Kiểm tra máy có mạng nội bộ.
3. Thử ping tên server và IP server.
4. Kiểm tra DNS nếu IP truy cập được nhưng hostname không được.
5. Xác định người dùng khác có truy cập được cùng thư mục không.

## Nguyên nhân
- Mất mạng/VPN.
- DNS không phân giải server.
- Server/share không hoạt động.
- Người dùng chưa có quyền.
- Credential Windows cũ hoặc sai.
- Ổ mạng map bằng tài khoản khác.

## Xử lý
Có thể kiểm tra kết nối hiện tại:
```cmd
net use
```
Map ổ mạng khi đã xác nhận quyền:
```cmd
net use Z: \\server\share /persistent:yes
```
Không lưu mật khẩu người dùng trực tiếp trong script hoặc file BAT.

## Access Denied
Không tự ý cấp quyền cao hơn. Ghi nhận thư mục, người dùng và nhu cầu truy cập; chuyển người quản trị File Server/chủ sở hữu dữ liệu phê duyệt theo quy trình.

## Chuyển cấp
- Nhiều người không truy cập được cùng share.
- Server không phản hồi.
- Cần thay đổi NTFS/share permission.
- Nghi ngờ mất hoặc mã hóa dữ liệu.

## Từ khóa
file server, shared folder, ổ mạng, map drive, access denied, network path, SMB