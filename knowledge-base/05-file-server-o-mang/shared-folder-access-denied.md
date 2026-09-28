# Shared Folder báo Access Denied

## Khoanh vùng
- Người dùng chưa từng có quyền hay trước đây truy cập được?
- Chỉ một thư mục hay toàn bộ share?
- Đồng nghiệp cùng nhóm có truy cập được không?

## Kiểm tra
1. Xác định đúng đường dẫn `\\server\share`.
2. Xác định tài khoản Windows đang sử dụng.
3. Kiểm tra quyền share và NTFS theo quy trình quản trị.
4. Kiểm tra người dùng đã thuộc đúng nhóm quyền chưa.
5. Nếu quyền vừa thay đổi, xác định có cần đăng xuất/đăng nhập lại để token quyền được cập nhật không.

## Nguyên tắc
Không cấp Full Control trực tiếp cho người dùng chỉ để xử lý nhanh. Ưu tiên nhóm quyền theo mô hình quản trị và nguyên tắc quyền tối thiểu.

## Từ khóa
Access Denied, shared folder, NTFS permission, file server, quyền thư mục