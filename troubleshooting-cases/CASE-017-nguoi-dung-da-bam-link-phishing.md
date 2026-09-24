# CASE-017 - Người dùng đã bấm link email phishing

## Người dùng báo
"Em vừa bấm vào link trong email, sau đó thấy trang đăng nhập lạ."

## Ưu tiên xử lý
1. Hỏi người dùng có nhập mật khẩu hoặc phê duyệt MFA không.
2. Ghi lại thời điểm, email gửi và hành động đã thực hiện.
3. Thực hiện quy trình ứng cứu tài khoản nếu credential có khả năng bị lộ.
4. Báo bộ phận An toàn thông tin theo mức độ sự cố.
5. Kiểm tra endpoint bằng công cụ bảo mật được phê duyệt nếu có tải/chạy file.

## Không làm
Không yêu cầu người dùng gửi lại mật khẩu. Không truy cập lại link độc hại từ máy làm việc chỉ để kiểm tra. Không xóa email/bằng chứng trước khi thông tin cần thiết được ghi nhận.

## Mức độ
Nếu đã nhập credential, phê duyệt MFA lạ, tải/chạy file hoặc nhiều người nhận cùng chiến dịch, ưu tiên cao/khẩn theo quy trình nội bộ.

## Từ khóa
case, phishing, bấm link, lộ mật khẩu, MFA, incident