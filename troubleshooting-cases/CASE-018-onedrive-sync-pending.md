# CASE-018 - OneDrive Sync Pending cả buổi

## Người dùng báo
"File em sửa sáng nay nhưng đồng nghiệp vẫn thấy bản cũ, OneDrive cứ quay Syncing."

## Quy trình
1. Kiểm tra file trên OneDrive web.
2. Xem thông báo lỗi tại biểu tượng OneDrive.
3. Kiểm tra Internet, tài khoản và dung lượng ổ C.
4. Xác định chỉ một file hay toàn bộ thư mục không đồng bộ.
5. Không xóa file cục bộ trước khi biết bản nào là dữ liệu mới nhất.

## Bài học
Với sự cố đồng bộ, phải xác định bản dữ liệu nào mới nhất và đang tồn tại ở đâu trước khi reset client để tránh mất dữ liệu.

## Từ khóa
case, OneDrive, sync pending, file cũ, Microsoft 365