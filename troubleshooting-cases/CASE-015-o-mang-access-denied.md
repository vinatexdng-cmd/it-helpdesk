# CASE-015 - Ổ mạng mở được nhưng thư mục báo Access Denied

## Người dùng báo
"Ổ Z vẫn thấy nhưng vào thư mục phòng ban thì báo không có quyền."

## Khoanh vùng
1. Xác định đường dẫn thư mục cụ thể.
2. Người dùng trước đây có quyền không?
3. Người cùng nhóm có truy cập được không?
4. Có thay đổi vị trí/phòng ban hoặc nhóm quyền gần đây không?

## Xử lý
Kiểm tra quyền theo nhóm được phê duyệt. Nếu thiếu quyền, thực hiện quy trình yêu cầu/phê duyệt thay vì cấp Full Control trực tiếp.

## Bài học
Kết nối tới file server thành công và lỗi quyền là hai lớp khác nhau; không cần remap ổ hoặc thay DNS nếu server/share vẫn truy cập được.

## Từ khóa
case, Access Denied, ổ mạng, quyền thư mục, file server