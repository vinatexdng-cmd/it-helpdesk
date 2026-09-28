# CASE-016 - Tài khoản liên tục bị khóa sau khi đổi mật khẩu

## Người dùng báo
"IT vừa mở khóa xong một lúc lại bị khóa tiếp."

## Tình huống thường gặp
Người dùng đã đổi mật khẩu nhưng điện thoại, Outlook, ổ mạng, scheduled task hoặc máy khác vẫn dùng credential cũ.

## Quy trình
1. Ghi nhận thời điểm lockout.
2. Dùng log/công cụ được cấp quyền xác định nguồn xác thực thất bại nếu có.
3. Kiểm tra các thiết bị/ứng dụng còn lưu credential cũ.
4. Cập nhật credential ở nguồn rồi mới đánh giá kết quả.

## Cảnh báo
Nếu nguồn đăng nhập không thuộc thiết bị của người dùng hoặc đến từ vị trí bất thường, chuyển xử lý an toàn thông tin.

## Từ khóa
case, account lockout, đổi mật khẩu, credential cũ, tài khoản bị khóa