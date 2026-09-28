# Outlook không gửi hoặc nhận được email

## Mô tả
Outlook mở được nhưng thư không gửi đi, không nhận thư mới, thư nằm ở Outbox hoặc ứng dụng báo Disconnected/Working Offline.

## Kiểm tra ban đầu
- Internet có hoạt động không.
- Outlook có đang ở chế độ Working Offline không.
- Webmail có gửi/nhận được không.
- Hộp thư có đầy không.
- Chỉ một người hay nhiều người cùng lỗi.
- Có email dung lượng lớn bị kẹt trong Outbox không.

## Phân loại nhanh
### Webmail hoạt động, Outlook lỗi
Ưu tiên kiểm tra Outlook profile, OST, add-in, credential và trạng thái đồng bộ.

### Webmail cũng lỗi
Ưu tiên kiểm tra tài khoản, dịch vụ mail, giấy phép/quota hoặc hệ thống máy chủ.

## Xử lý
1. Kiểm tra trạng thái kết nối Outlook.
2. Thử Send/Receive.
3. Kiểm tra Outbox và file đính kèm lớn.
4. Khởi động lại Outlook.
5. Kiểm tra Credential/Profile nếu liên tục hỏi mật khẩu.
6. Chỉ tạo profile mới sau khi đã xác định profile hiện tại có vấn đề và bảo đảm dữ liệu người dùng được bảo toàn.

## Lưu ý dữ liệu
Không xóa PST/OST hoặc profile trước khi xác định loại tài khoản và vị trí dữ liệu. PST có thể chứa dữ liệu cục bộ không tồn tại trên máy chủ.

## Chuyển cấp
- Nhiều tài khoản cùng mất dịch vụ.
- Webmail không hoạt động.
- Tài khoản bị khóa hoặc nghi bị xâm nhập.
- Có lỗi chính sách/giấy phép phía hệ thống mail.

## Từ khóa
Outlook, email, không gửi mail, không nhận mail, outbox, offline, mailbox